"""add status to task table

Revision ID: 024039a30669
Revises: 0b6cd781aa81
Create Date: 2023-06-29 17:11:08.092671

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '024039a30669'
down_revision = '0b6cd781aa81'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_column('status')

    # ### end Alembic commands ###
