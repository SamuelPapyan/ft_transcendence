# Generated by Django 4.2.11 on 2024-04-20 09:54

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_alter_match_start_alter_message_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='start',
            field=models.DateTimeField(default=datetime.datetime(2024, 4, 20, 13, 54, 23, 98816)),
        ),
        migrations.AlterField(
            model_name='message',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2024, 4, 20, 13, 54, 23, 99838)),
        ),
    ]