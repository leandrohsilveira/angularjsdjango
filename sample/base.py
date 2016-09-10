from django.conf.urls import url, include
from django.http import JsonResponse
from django.forms.models import model_to_dict

class Resources:
	model=None
	fields_whitelist=None

	@classmethod
	def register_resources(cls, url_regex, namespace):
		return url(url_regex, include(cls.__get_urls()), name=namespace)

	@classmethod
	def __get_urls(cls):
		return [
			url(r'^$', cls.__handle, name='resource'),
			url(r'^(?P<pk>[0-9]+)$', cls.__handle, name='resource_pk'),
		]

	@classmethod
	def __get_allowed_fields(cls, fields):
		allowed = []
		if fields:
			for field in fields:
				if field in cls.fields_whitelist:
					allowed.append(field)
		if allowed:
			return allowed
		return cls.fields_whitelist

	@classmethod
	def __handle(cls, request, pk=None):
		if request.method == 'GET':
			return cls.__handle_get(request, request.GET, pk)

	@classmethod
	def __handle_get(cls, request, method_obj, pk=None):
		fields = cls.__get_allowed_fields(method_obj.getlist("field"))

		if pk:
			return cls.__get_model(request, pk, fields)
		else:
			limit = int(method_obj.get("limit", 10))
			first = int(method_obj.get("page", 1)) * limit - limit
			last = first + limit;
			return cls.__get_list(request, fields, first, last)

	@classmethod
	def __serialize(cls, obj):
		return JsonResponse(obj)

	@classmethod
	def __get_model(cls, request, pk, fields):
		model = cls.model.objects.get(id=pk)
		model_dict = model_to_dict(model, fields=fields)
		#print(model_dict)
		return cls.__serialize(model_dict)

	@classmethod
	def __get_list(cls, request, fields, first=0, last=10):
		result = cls.model.objects.all().values(*fields)[first:last]
		count = cls.model.objects.count()
		return cls.__serialize({ "result": list(result), "count": count })
