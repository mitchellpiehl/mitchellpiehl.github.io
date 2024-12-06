from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

# Define the Base
Base = declarative_base()

# Define the tables using SQLAlchemy ORM
class NFLTeam(Base):
    __tablename__ = 'nfl_teams'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


class FantasyPlayer(Base):
    __tablename__ = 'fantasy_players'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    nfl_team_id = Column(Integer, ForeignKey('nfl_teams.id'))
    nfl_team = relationship("NFLTeam", back_populates="players")


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)


class League(Base):
    __tablename__ = 'league'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    commissioner_id = Column(Integer, ForeignKey('users.id'))
    commissioner = relationship("User")


class FantasyTeam(Base):
    __tablename__ = 'fantasy_teams'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    league_id = Column(Integer, ForeignKey('league.id'))
    name = Column(String, nullable=False)
    wins = Column(Integer, nullable=False)
    losses = Column(Integer, nullable=False)
    ties = Column(Integer, nullable=False)
    playoff_status = Column(Boolean, default=False)
    league = relationship("League")
    user = relationship("User")


class PlayerOnFantasyTeam(Base):
    __tablename__ = 'player_on_fantasy_team'
    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey('fantasy_players.id'))
    fantasy_team_id = Column(Integer, ForeignKey('fantasy_teams.id'))
    week = Column(Integer, nullable=False)
    player = relationship("FantasyPlayer")
    fantasy_team = relationship("FantasyTeam")


class TeamPerformance(Base):
    __tablename__ = 'team_performance'
    id = Column(Integer, primary_key=True)
    fantasy_team_id = Column(Integer, ForeignKey('fantasy_teams.id'))
    week = Column(Integer, nullable=False)
    points = Column(Integer, nullable=False)
    rank = Column(Integer, nullable=False)
    playoff_status = Column(Boolean, nullable=False)
    fantasy_team = relationship("FantasyTeam")


NFLTeam.players = relationship("FantasyPlayer", back_populates="nfl_team")

# Database setup
engine = create_engine('sqlite:///FantasyFootball.db')
Base.metadata.create_all(engine)

# Create a session
Session = sessionmaker(bind=engine)
session = Session()

# Insert initial data
nfl_teams_data = [
    NFLTeam(id=1, name="Minnesota Vikings"),
    NFLTeam(id=2, name="New England Patriots"),
    NFLTeam(id=3, name="Kansas City Chiefs"),
    NFLTeam(id=4, name="Dallas Cowboys"),
    NFLTeam(id=5, name="Green Bay Packers")
]
session.add_all(nfl_teams_data)

fantasy_players_data = [
    FantasyPlayer(id=1, name="Justin Jefferson", position="WR", nfl_team_id=1),
    FantasyPlayer(id=2, name="Drake Maye", position="QB", nfl_team_id=2),
    FantasyPlayer(id=3, name="Jordan Addison", position="WR", nfl_team_id=1),
    FantasyPlayer(id=4, name="Josh Jacobs", position="RB", nfl_team_id=5),
    FantasyPlayer(id=5, name="CeeDee Lamb", position="WR", nfl_team_id=4),
    FantasyPlayer(id=6, name="Isiah Pacheco", position="RB", nfl_team_id=3)
]
session.add_all(fantasy_players_data)

users_data = [
    User(id=1, first_name="Hunter", last_name="Dunn", email="04hunterdunn@gmail.com"),
    User(id=2, first_name="Mitchell", last_name="Piehl", email="pieh6361@stthomas.edu"),
    User(id=3, first_name="Alice", last_name="Brown", email="alice.brown@example.com"),
    User(id=4, first_name="Charlie", last_name="Davis", email="charlie.davis@example.com"),
    User(id=5, first_name="Eva", last_name="Smith", email="eva.smith@example.com")
]
session.add_all(users_data)

leagues_data = [
    League(id=1, name="Big Ballas", commissioner_id=3),
    League(id=2, name="The Neighbors League", commissioner_id=1),
    League(id=3, name="Champions League", commissioner_id=2),
    League(id=4, name="Rookies League", commissioner_id=5)
]
session.add_all(leagues_data)

fantasy_teams_data = [
    FantasyTeam(id=1, user_id=3, league_id=1, name="Alice's Team", wins=8, losses=2, ties=1),
    FantasyTeam(id=2, user_id=2, league_id=3, name="Mitch's Team", wins=9, losses=2, ties=0),
    FantasyTeam(id=3, user_id=1, league_id=2, name="Hunter's Team", wins=7, losses=4, ties=0),
    FantasyTeam(id=4, user_id=5, league_id=4, name="Eva's Team", wins=8, losses=3, ties=0),
    FantasyTeam(id=5, user_id=1, league_id=1, name="Team Alpha", wins=5, losses=6, ties=0),
    FantasyTeam(id=6, user_id=4, league_id=3, name="Team Charlie", wins=2, losses=9, ties=0),
    FantasyTeam(id=7, user_id=3, league_id=2, name="Team Bravo", wins=4, losses=6, ties=1)
]
session.add_all(fantasy_teams_data)

player_on_fantasy_team_data = [
    PlayerOnFantasyTeam(player_id=3, fantasy_team_id=1, week=2),
    PlayerOnFantasyTeam(player_id=2, fantasy_team_id=5, week=3),
    PlayerOnFantasyTeam(player_id=1, fantasy_team_id=6, week=1),
    PlayerOnFantasyTeam(player_id=4, fantasy_team_id=4, week=4),
    PlayerOnFantasyTeam(player_id=5, fantasy_team_id=2, week=1),
    PlayerOnFantasyTeam(player_id=6, fantasy_team_id=3, week=3),
    PlayerOnFantasyTeam(player_id=7, fantasy_team_id=2, week=2)
]
session.add_all(player_on_fantasy_team_data)

team_performance_data = [
    TeamPerformance(fantasy_team_id=1, week=8, points=102, rank=6, playoff_status=True),
    TeamPerformance(fantasy_team_id=6, week=8, points=97, rank=1, playoff_status=False),
    TeamPerformance(fantasy_team_id=3, week=10, points=135, rank=7, playoff_status=True),
    TeamPerformance(fantasy_team_id=7, week=10, points=130, rank=3, playoff_status=False),
    TeamPerformance(fantasy_team_id=2, week=11, points=143, rank=6, playoff_status=True),
    TeamPerformance(fantasy_team_id=6, week=11, points=120, rank=2, playoff_status=False)
]
session.add_all(team_performance_data)

# Commit the changes
session.commit()