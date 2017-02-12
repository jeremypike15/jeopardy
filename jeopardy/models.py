import uuid
from django.db import models


class ObjectType():
	'''
	A helper class to store constants for object types
	'''
	
	TEXT = 'text'
	IMAGE = 'image'
	VIDEO = 'video'


class Board(models.Model):
	'''
	A user-created game board, with optional password protection.
	'''
	
	id = models.UUIDField(primary_key=True, default=uuid.uuid4)
	name = models.CharField(max_length=50)
	description = models.CharField(max_length=500, blank=True, null=True)
	categories = models.ManyToManyField('BoardCategory')
	daily_doubles = models.ManyToManyField('Clue')
	password_edit = models.CharField(max_length=36)
	password_play = models.CharField(max_length=36, blank=True, null=True)


class BoardCategoryMembership(models.Model):
	'''
	An interstitial table that defines placement information for
	categories on specific game boards, including double Jeopardy.
	'''
	
	id = models.UUIDField(primary_key=True, default=uuid.uuid4)
	board = models.ForeignKey('Board')
	category = models.ForeignKey('Category')
	placement = models.IntegerRangeField(lower=1, upper=6)
	double_jeopardy = models.BooleanField(default=False)
	
	
class Category(models.Model):
	'''
	A category containing 5 clues.
	'''
	
	id = models.UUIDField(primary_key=True, default=uuid.uuid4)
	name = models.CharField(max_length=50)
	clues = models.ManyToManyField('Clue')
	final_jeopardy = models.BooleanField(default=False)


class Clue(models.Model):
	'''
	A Clue object containing a question and answer.
	Value is determined based on placement and round.
	'''
	
	CLUE_TYPES = (
		(ObjectType.TEXT, 'Text'),
		(ObjectType.IMAGE, 'Image'),
		(ObjectType.VIDEO, 'Video'),
	)
	
	id = models.UUIDField(primary_key=True, default=uuid.uuid4)
	clue_type = models.CharField(choices=CLUE_TYPES, default=ObjectType.TEXT)
	clue = models.CharField(max_length=500)
	answer = models.CharField(max_length=500)
	placement = models.IntegerRangeField(lower=1, upper=5)