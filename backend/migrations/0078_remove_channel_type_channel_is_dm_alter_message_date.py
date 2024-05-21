# Generated by Django 4.2.11 on 2024-05-18 11:11

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0077_message_channel'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='channel',
            name='type',
        ),
        migrations.AddField(
            model_name='channel',
            name='is_dm',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2024, 5, 18, 15, 11, 3, 994096)),
        ),
    ]