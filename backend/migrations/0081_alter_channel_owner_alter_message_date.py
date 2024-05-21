# Generated by Django 4.2.11 on 2024-05-18 12:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0080_alter_message_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='channel',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='message',
            name='date',
            field=models.DateTimeField(null=True),
        ),
    ]