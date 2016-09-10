from django.conf.urls import url, include

from .views import app, load_template, UserResources

urlpatterns = [

	url(r'^$', app, name='app'),

	url(r'^template/(?P<template>\S+)', load_template, name='load_template'),

	UserResources.register_resources(r'^api/users/', 'users'),
]
