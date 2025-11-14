from datetime import datetime
from app import db

class Message(db.Model):
    __tablename__ = "message"
    id = db.Column(db.Integer, primary_key = True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat_history.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    
    
class Chat(db.Model):
    __tablename__ = "chat_history"
    
    id = db.Column(db.Interger, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    
    messages = db.relationship(
        'message', 
        backref='chat', 
        cascade='all, delete-orphan', 
        order_by='Message.timestamp'
    )