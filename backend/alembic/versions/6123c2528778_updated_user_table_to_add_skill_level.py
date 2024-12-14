"""Updated user table to add skill level

Revision ID: 6123c2528778
Revises: ed118dda3e1c
Create Date: 2024-12-14 00:48:28.217561

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6123c2528778'
down_revision: Union[str, None] = 'ed118dda3e1c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('skill_level', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'skill_level')
    # ### end Alembic commands ###
