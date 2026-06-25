from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

tag_item_cardapio_pg_enum = ENUM(
    "LOW_CARB",
    "ALTO_EM_PROTEINA",
    "VEGANO",
    "VEGETARIANO",
    "ZERO_LACTOSE",
    "ZERO_GLUTEN",
    "SEM_ACUCAR",
    name="tag_item_cardapio_enum",
    create_type=False,
)


class ItemCardapioTagModel(Base):
    __tablename__ = "itens_cardapio_tags"

    item_cardapio_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("itens_cardapio.id", ondelete="CASCADE"),
        primary_key=True,
    )
    tag: Mapped[str] = mapped_column(tag_item_cardapio_pg_enum, primary_key=True)
