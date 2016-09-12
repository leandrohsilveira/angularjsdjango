from django.conf.urls import url, include
from django.http import JsonResponse
from django.forms.models import model_to_dict

class Resources:
	model=None
	fields_whitelist=None

	def get_fields_filters(self):
		return {}

	@classmethod
	def register_resources(cls, url_regex, namespace):
		return url(url_regex, include(cls().__get_urls()), name=namespace)

	def __get_urls(self):
		return [
			url(r'^$', self.__handle, name='resource'),
			url(r'^(?P<pk>[0-9]+)$', self.__handle, name='resource_pk'),
		]

	def __get_allowed_fields(self, fields):
		allowed = []
		if fields:
			for field in fields:
				if field in self.fields_whitelist:
					allowed.append(field)
		if allowed:
			return allowed
		return self.fields_whitelist

	def __handle(self, request, pk=None):
		if request.method == 'GET':
			return self.__handle_get(request, pk)

	def __handle_get(self, request, pk=None):
		fields = self.__get_allowed_fields(request.GET.getlist("f"))

		if pk:
			return self.__get_model(request, pk, fields)
		else:
			limit = int(request.GET.get("l", 10))
			first = int(request.GET.get("p", 1)) * limit - limit
			last = first + limit;
			filters_values = self.__get_filters_values(request.GET)
			return self.__get_list(request, fields, first, last, filters_values)

	def __get_filters_values(self, method_obj):
		values = {}
		fields_filters = self.get_fields_filters()
		for key in fields_filters:
			value = method_obj.get(key)
			if value:
				values[key] = value
		return values

	def __serialize(self, obj):
		return JsonResponse(obj)

	def __get_model(self, request, pk, fields):
		model = self.model.objects.get(id=pk)
		model_dict = model_to_dict(model, fields=fields)
		#print(model_dict)
		return self.__serialize(model_dict)

	def __get_list(self, request, fields, first=0, last=10, filters_values={}):
		fields_filters = self.get_fields_filters()
		query = self.model.objects

		if fields_filters:
			for key in filters_values:
				filter = fields_filters.get(key)
				value = filters_values.get(key)
				query = filter(query, value)
		else:
			query = query.all()

		result = query.values(*fields)[first:last]
		count = self.model.objects.count()
		return self.__serialize({ "result": list(result), "count": count })
