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
	active = models.BooleanField(default=False)
	name = models.CharField(max_length=50)
	description = models.CharField(max_length=500, blank=True, null=True)
	categories = models.ManyToManyField('BoardCategoryMembership', related_name='board_categories', blank=True)
	daily_doubles = models.ManyToManyField('Clue', blank=True)
	password_edit = models.CharField(max_length=36)
	password_play = models.CharField(max_length=36, blank=True, null=True)
	
	def __str__(self):
		return self.name
	


class BoardCategoryMembership(models.Model):
	'''
	An interstitial table that defines placement information for
	categories on specific game boards, including double Jeopardy.
	'''
	
	id = models.UUIDField(primary_key=True, default=uuid.uuid4)
	board = models.ForeignKey('Board')
	category = models.ForeignKey('Category')
	placement = models.IntegerField()
	double_jeopardy = models.BooleanField(default=False)
	
	def __str__(self):
		return '%s - %s' % (self.board, self.category)
	
	
class Category(models.Model):
	'''
	A category containing 5 clues.
	'''
	
	id = models.UUIDField(primary_key=True, default=uuid.uuid4)
	name = models.CharField(max_length=50)
	clues = models.ManyToManyField('Clue', blank=True)
	final_jeopardy = models.BooleanField(default=False)
	
	def __str__(self):
		return self.name


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
	clue_type = models.CharField(choices=CLUE_TYPES, default=ObjectType.TEXT, max_length=50)
	clue = models.CharField(max_length=500)
	answer = models.CharField(max_length=500)
	placement = models.IntegerField()
	
	def __str__(self):
		return self.clue