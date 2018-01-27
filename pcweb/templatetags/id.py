from django import template
register = template.Library()
import re

@register.filter("mongo_id")
def mongo_id(value):
    return str(value['_id'])

@register.filter
def replace_space(string):
    return re.sub(r'\W+', '_', string)
    return string.replace(' ', '_').replace(',', '_')