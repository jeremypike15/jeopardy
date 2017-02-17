from rest_framework.serializers import ModelSerializer, SerializerMethodField

from jeopardy.models import Board, BoardCategoryMembership, Category, Clue

class ClueSerializer(ModelSerializer):
	
	class Meta:
		model = Clue
		fields = '__all__'


class CategorySerializer(ModelSerializer):
	
	def get_clues(self, category):
		return ClueSerializer(category.clues.order_by('placement'), many=True).data
	
	clues = SerializerMethodField()
	
	class Meta:
		model = Category
		fields = ('name', 'clues', 'final_jeopardy')


class BoardCategorySerializer(ModelSerializer):
	
	def get_data(self, board_category):
		return CategorySerializer(board_category.category).data
		
	data = SerializerMethodField()
	
	class Meta:
		model = BoardCategoryMembership
		fields = ('placement', 'double_jeopardy', 'data')

		
class BoardSerializer(ModelSerializer):
	
	def get_categories(self, board):
		board_categories = BoardCategoryMembership.objects.filter(board=board).order_by('placement')
		serializer = BoardCategorySerializer(board_categories, many=True)
		
		return serializer.data
	
	categories = SerializerMethodField()
	
	class Meta:
		model = Board
		fields = ('name', 'categories', 'daily_doubles')