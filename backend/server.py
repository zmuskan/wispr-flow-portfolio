import asyncio
import logging
import os
import re
import uuid
from contextlib import suppress
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field
from starlette.middleware.cors import CORSMiddleware

try:
    from motor.motor_asyncio import AsyncIOMotorClient
    from pymongo import ASCENDING, DESCENDING, IndexModel
except Exception:  # pragma: no cover
    AsyncIOMotorClient = None
    ASCENDING = DESCENDING = None
    IndexModel = None

ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
client = AsyncIOMotorClient(MONGO_URL) if AsyncIOMotorClient and MONGO_URL else None
db = client[DB_NAME] if client and DB_NAME else None

INDEXES: dict[str, list[Any]] = {
    "status_checks": [
        {"name": "id", "index": [("id", ASCENDING)]},
        {"name": "timestamp_desc", "index": [("timestamp", DESCENDING)]},
    ]
}


async def ensure_indexes() -> None:
    if not db or not IndexModel:
        return
    for collection, models in INDEXES.items():
        for model in models:
            try:
                await db[collection].create_indexes([IndexModel(model["index"], name=model["name"], unique=(model["name"] == "id"))])
            except Exception as exc:
                logging.getLogger(__name__).error("ensure_indexes(%s.%s): %s", collection, model["name"], exc)


PORTFOLIO_KB = [
    {
        "title": "About Muskan and background",
        "text": "Muskan is a software, data and applied AI practitioner who builds data-driven applications that turn complex information into useful decisions. Her background is in Chemical Engineering, which gave her a foundation in problem-solving, experimentation and analysis. Her portfolio emphasizes personal storytelling, warm editorial design and project work across software, data and applied AI.",
    },
    {
        "title": "PAT Technologies internship",
        "text": "PAT Technologies is a business-management and analytics internship experience. Muskan worked on project monitoring, analytical tasks and business-management workflows, applying statistical methods and structured reporting. The work included operational reporting, data-oriented analysis and internship responsibilities in a business and cloud architecture context.",
    },
    {
        "title": "NIVAAS project",
        "text": "NIVAAS is an Urban Intelligence & Locality Recommendation Platform for evaluating rental localities in Bengaluru. The platform uses rental analytics, engineered locality features, geospatial data and recommendation logic to help users assess localities. The stack includes Python, FastAPI, Supabase PostgreSQL, PostGIS, React, TypeScript, Vite, Zustand, Axios, TanStack Router, scikit-learn, NumPy, Docker, Vercel and Render. The platform is designed to combine rental data, geospatial intelligence and ranking logic in a usable web application.",
    },
    {
        "title": "ANSME project",
        "text": "ANSME is a Product Intelligence & Comparison Engine. It extracts product information from URLs and compares alternatives using structured analysis, custom scoring, price and rating evaluation, and deterministic verdicts. The stack includes Python, FastAPI, PostgreSQL, SQLAlchemy, Pydantic, BeautifulSoup, Trafilatura, React, TypeScript, Vite and Docker. The system is focused on extracting product data from webpages and comparing options with a structured, transparent scoring approach.",
    },
    {
        "title": "Mini RAG Bot project",
        "text": "Mini RAG Bot is a local document question-answering application using retrieval-augmented generation. It allows users to ask questions about supplied documents and retrieve relevant context. The implementation stack includes Python, Streamlit, Sentence Transformers, FAISS, Ollama, Llama 3 and LangChain.",
    },
    {
        "title": "Technology stack",
        "text": "Muskan works with Python, SQL, JavaScript, TypeScript, NumPy, Pandas and scikit-learn. Her backend engineering work includes FastAPI, Flask, REST APIs, Pydantic and SQLAlchemy. She also uses PostgreSQL, Supabase, PostGIS, database design, data modelling and relational databases. Her frontend work includes React, TypeScript, Vite, Tailwind CSS, Zustand, Axios, TanStack Router and Streamlit. She is also exploring or using Docker, Git, GitHub, Vercel, Render, Jupyter Notebook and Microsoft Fabric. Her AI and ML tooling includes machine learning workflows, LangChain, FAISS, Ollama, OpenAI or ChatGPT, Google Gemini API, Claude, GitHub Copilot and Prompt Engineering.",
    },
    {
        "title": "Courses and certifications",
        "text": "Completed courses include Data Scientist Associate from DataCamp, Programming in Python from Meta, Python for Data Analysis: Pandas & NumPy from Coursera Project Network, Introduction to Data Analytics on Google Cloud from Google Cloud, and Database and SQL from Infosys Springboard. In progress are Mathematics for Machine Learning and Machine Learning Specialization. She is also familiar with Generative AI from DeepLearning.AI and data systems and pipelines concepts and tools.",
    },
    {
        "title": "Engineering interests and goals",
        "text": "Engineering interests include data engineering and SQL, backend systems and REST APIs, feature engineering and analytics, recommendation and ranking systems, geospatial intelligence, applied AI and retrieval workflows, Docker and application deployment, software architecture and system design, testing, reliability and maintainability. Her current focus is on building production-minded applications, strengthening software engineering fundamentals, developing deeper expertise in data and applied AI, improving testing, reliability and system design, and exploring data, backend and AI engineering opportunities.",
    },
    {
        "title": "Wispr Flow portfolio-building experience",
        "text": "The Wispr Flow portfolio-building experience is described as a voice-driven workflow for turning a spoken idea into a structured portfolio narrative. The portfolio build log includes a dictated prompt, a structured system output, a correction to make the portfolio more personal, and a final result that became an interactive six-scene scrapbook portfolio with storytelling, project demonstrations, a technology toolkit and a voice-first build story. The project explores how voice can capture ideas and support a more natural creative workflow.",
    },
]


STOP_WORDS = {
    "a", "about", "after", "all", "also", "am", "an", "and", "any", "are", "as", "at",
    "be", "been", "before", "being", "between", "but", "by", "can", "could", "did", "do",
    "does", "doing", "for", "from", "had", "has", "have", "having", "how", "i", "if", "in",
    "into", "is", "it", "its", "just", "know", "me", "more", "most", "no", "not", "of",
    "on", "or", "our", "out", "over", "should", "so", "some", "such", "tell", "than", "that",
    "the", "their", "them", "there", "these", "they", "this", "those", "through", "to", "too",
    "under", "up", "very", "was", "we", "were", "what", "when", "where", "which", "who",
    "why", "will", "with", "you", "your"
}


def _normalize_text(value: str) -> str:
    return re.sub(r"[^a-z0-9\s-]", " ", value.lower())


def _score_chunk(chunk_text: str, question: str) -> float:
    q_text = _normalize_text(question)
    q_tokens = {
        token for token in re.split(r"\s+", q_text)
        if token and len(token) > 2 and token not in STOP_WORDS
    }
    if not q_tokens:
        return 0.0

    chunk_text_norm = _normalize_text(chunk_text)
    chunk_tokens = set(re.split(r"\s+", chunk_text_norm))
    overlap = q_tokens.intersection(chunk_tokens)
    if not overlap:
        return 0.0

    phrase_boost = 0
    for phrase in [
        "nivaas",
        "ansme",
        "mini rag bot",
        "wispr",
        "pat technologies",
        "python",
        "fastapi",
        "postgresql",
        "react",
        "gemini",
        "sql",
        "ai",
        "data",
    ]:
        if phrase in chunk_text_norm and phrase in q_text:
            phrase_boost += 1
    return len(overlap) * 3 + phrase_boost + len(overlap)


def retrieve_context(question: str, limit: int = 4) -> str:
    scored = [( _score_chunk(chunk["text"], question), chunk ) for chunk in PORTFOLIO_KB]
    scored.sort(key=lambda item: item[0], reverse=True)
    selected = [chunk for score, chunk in scored if score > 0]
    if not selected:
        return ""

    relevant = selected[:limit]
    return "\n\n".join(f"### {chunk['title']}\n{chunk['text']}" for chunk in relevant)


async def generate_with_gemini(question: str, context: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured on the backend.")

    try:
        from google import genai
    except Exception as exc:  # pragma: no cover
        raise RuntimeError("The google-genai SDK is not installed. Add it to backend requirements.") from exc

    prompt = f"""
You are a portfolio assistant for Muskan's portfolio.
Answer only from the retrieved portfolio context below.
If the answer is not in the context, say exactly: "This portfolio does not contain enough information to answer that confidently."
Do not invent facts, qualifications, technologies, internships, projects, or responsibilities.
Do not claim work that is planned rather than already described.

Retrieved context:
{context}

User question: {question}
"""

    try:
        client = genai.Client(api_key=api_key)
        response = await asyncio.wait_for(
            asyncio.to_thread(client.models.generate_content, model="gemini-3.5-flash-lite", contents=prompt),
            timeout=25,
        )
        answer = getattr(response, "text", None) or str(response)
        return answer.strip() or "This portfolio does not contain enough information to answer that confidently."
    except Exception as exc:  # pragma: no cover
        raise RuntimeError("Gemini request failed or timed out.") from exc


app = FastAPI(title="Portfolio assistant API")
api_router = APIRouter(prefix="/api")


class StatusCheckCreate(BaseModel):
    client_name: str


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[dict[str, str]] = Field(default_factory=list)


class ChatMessageResponse(BaseModel):
    reply: str
    model: str = "gemini-3.5-flash-lite"
    used_context: bool = True


@api_router.get("/")
async def root() -> dict[str, str]:
    return {"message": "Portfolio assistant API is running."}


@api_router.get("/health")
async def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "mongodb_configured": bool(MONGO_URL and DB_NAME),
    }


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    if not db:
        raise HTTPException(status_code=503, detail="MongoDB is not configured on this backend.")

    status_obj = StatusCheck(client_name=input.client_name)
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=list[StatusCheck])
async def get_status_checks(limit: int = Query(20, ge=1, le=100)):
    if not db:
        raise HTTPException(status_code=503, detail="MongoDB is not configured on this backend.")

    status_checks = await db.status_checks.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    for check in status_checks:
        if isinstance(check["timestamp"], str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])
    return status_checks


@api_router.post("/assistant/chat", response_model=ChatMessageResponse)
async def assistant_chat(payload: ChatMessageRequest):
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    context = retrieve_context(message)
    if not context:
        return ChatMessageResponse(
            reply="This portfolio does not contain enough information to answer that confidently.",
            used_context=False,
        )

    try:
        answer = await generate_with_gemini(message, context)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover
        logger.exception("Gemini request failed")
        raise HTTPException(status_code=500, detail="The assistant could not generate a response.") from exc

    return ChatMessageResponse(reply=answer, used_context=bool(context))


app.include_router(api_router)

origin_values = []
for raw in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(","):
    value = raw.strip()
    if value:
        origin_values.append(value)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin_values,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def start_index_build():
    if db:
        app.state.index_task = asyncio.create_task(ensure_indexes())


@app.on_event("shutdown")
async def shutdown_db_client():
    if hasattr(app.state, "index_task"):
        app.state.index_task.cancel()
        with suppress(asyncio.CancelledError):
            await app.state.index_task
    if client is not None:
        client.close()
