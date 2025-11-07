from . import db

class User(db.Model):
    __tablename__ = 'users'
    
    uid = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.Text, nullable = False)
    age = db.Column(db.Integer)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    
    
    def __repr__(self):
        return f'User with ID {self.uid} and name {self.name}'


class Food(db.Model):
    __tablename__ = 'foods'
    
    fid = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.Text, nullable = False)
    description = db.Column(db.Text)

    # user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # submitter = db.relationship('User', backref=db.backref('foods', lazy=True))
    
    def __repr__(self):
        return f'<Food {self.name}>'
    

    
    
    
    