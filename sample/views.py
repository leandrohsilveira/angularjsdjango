from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q
from .base import Resources

# Create your views here.
def app(request):
	return render(request, 'sample/template.html')

def load_template(request, template):
	return render(request, 'sample/%s' % template)



class UserResources(Resources):
	model=User
	fields_whitelist=("id", "username", "email", "first_name", "last_name")

	def get_fields_filters(self):
		return {
			"name": self.filter_full_name
		}

	def filter_full_name(self, query, value):
		for term in value.split():
			query = query.filter( Q(first_name__icontains = term) | Q(last_name__icontains = term))
		return query
