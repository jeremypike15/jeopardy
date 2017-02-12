from rest_framework.serializers import ModelSerializer, SerializerMethodField

from jeopardy.models import Board, BoardCategoryMembership


class BoardCategorySerializer(ModelSerializer):
	
	class Meta:
		model = BoardCategoryMembership
		fields = '__all__'

		
class BoardSerializer(ModelSerializer):
	
	def get_categories(self, board):
		board_categories = BoardCategoryMembership.objects.filter(board=board).order_by('placement')
		serializer = BoardCategorySerializer(board_categories, many=True)
		
		return serializer.data
	
	categories = SerializerMethodField()
	
	class Meta:
		model = Board
		fields = ('name', 'categories', 'daily_doubles')