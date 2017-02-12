from django.contrib import admin
from jeopardy.models import Board, Category, BoardCategoryMembership, Clue

admin.site.register(Board)
admin.site.register(Category)
admin.site.register(BoardCategoryMembership)
admin.site.register(Clue)