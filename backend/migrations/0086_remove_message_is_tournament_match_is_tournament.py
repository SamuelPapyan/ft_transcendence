# Generated by Django 4.2.11 on 2024-05-23 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0085_message_is_tournament'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='is_tournament',
        ),
        migrations.AddField(
            model_name='match',
            name='is_tournament',
            field=models.BooleanField(default=False),
        ),
    ]