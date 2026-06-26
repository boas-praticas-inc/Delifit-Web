from __future__ import annotations

import base64
import hashlib
import hmac
import json
from datetime import UTC, datetime, timedelta
from typing import Any

from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def gerar_hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)


def verificar_senha(senha: str, senha_hash: str) -> bool:
    return pwd_context.verify(senha, senha_hash)


def gerar_access_token(usuario_id: int) -> str:
    agora = datetime.now(UTC)
    expira_em = agora + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": str(usuario_id),
        "exp": int(expira_em.timestamp()),
        "iat": int(agora.timestamp()),
    }
    return _codificar_jwt(payload)


def validar_access_token(token: str) -> dict[str, Any] | None:
    try:
        header_b64, payload_b64, assinatura_b64 = token.split(".")
    except ValueError:
        return None

    assinatura_esperada = _assinar(f"{header_b64}.{payload_b64}")
    if not hmac.compare_digest(assinatura_b64, assinatura_esperada):
        return None

    try:
        payload = json.loads(_base64url_decode(payload_b64))
    except (ValueError, json.JSONDecodeError):
        return None

    exp = payload.get("exp")
    sub = payload.get("sub")
    if not isinstance(exp, int) or not isinstance(sub, str):
        return None

    agora = int(datetime.now(UTC).timestamp())
    if exp < agora:
        return None

    return payload


def _codificar_jwt(payload: dict[str, Any]) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _base64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _base64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    assinatura_b64 = _assinar(f"{header_b64}.{payload_b64}")
    return f"{header_b64}.{payload_b64}.{assinatura_b64}"


def _assinar(valor: str) -> str:
    assinatura = hmac.new(
        settings.secret_key.encode("utf-8"),
        valor.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return _base64url_encode(assinatura)


def _base64url_encode(valor: bytes) -> str:
    return base64.urlsafe_b64encode(valor).rstrip(b"=").decode("utf-8")


def _base64url_decode(valor: str) -> bytes:
    padding = "=" * (-len(valor) % 4)
    return base64.urlsafe_b64decode(f"{valor}{padding}")
