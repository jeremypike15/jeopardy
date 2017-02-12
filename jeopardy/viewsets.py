from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.response import Response

from jeopardy.serializers import BoardSerializer
from jeopardy.models import Board


class BoardViewSet(ReadOnlyModelViewSet):
	queryset = Board.objects.filter(active=True)
	serializer_class = BoardSerializer

	def get(self, request, pk=None):
		board = get_object_or_404(self.queryset, pk=pk)
		serializer = BoardSerializer(board)
		
		return Response(serializer.data)