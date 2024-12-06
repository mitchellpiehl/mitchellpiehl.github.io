from flask import Flask, render_template, request, redirect, url_for
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, func
from fantasy import Base, NFLTeam, FantasyPlayer, FantasyTeam, PlayerOnFantasyTeam, TeamPerformance, User, League

app = Flask(__name__)

# Database setup
engine = create_engine('sqlite:///FantasyFootball.db')
Base.metadata.bind = engine
Session = sessionmaker(bind=engine)
session = Session()

@app.route('/')
def index():
    leagues = session.query(League).all()
    return render_template('index.html', leagues=leagues)

@app.route('/league/<int:league_id>')
def league(league_id):
    league = session.query(League).filter_by(id=league_id).one()
    teams = session.query(FantasyTeam).filter_by(league_id=league_id).all()
    return render_template('league.html', league=league, teams=teams)

@app.route('/add_team', methods=['GET', 'POST'])
def add_team():
    if request.method == 'POST':
        name = request.form['name']
        user_id = request.form['user_id']
        league_id = request.form['league_id']
        new_team = FantasyTeam(name=name, user_id=user_id, league_id=league_id, wins=0, losses=0, ties=0, playoff_status=False)
        session.add(new_team)
        session.commit()
        return redirect(url_for('league', league_id=league_id))
    users = session.query(User).all()
    leagues = session.query(League).all()
    return render_template('add_team.html', users=users, leagues=leagues)

@app.route('/update_performance', methods=['GET', 'POST'])
def update_performance():
    if request.method == 'POST':
        player_id = request.form['player_id']
        week = int(request.form['week'])
        points = int(request.form['points'])
        team_id = request.form['team_id']

        # Add new performance data
        team = session.query(FantasyTeam).filter_by(id=team_id).one()
        team_performance = TeamPerformance(fantasy_team_id=team_id, week=week, points=points, rank=0, playoff_status=False)
        session.add(team_performance)
        session.commit()

        # Update team score
        total_points = session.query(func.sum(TeamPerformance.points)).filter_by(fantasy_team_id=team_id).scalar()
        team.points = total_points
        session.commit()

        return redirect(url_for('league', league_id=team.league_id))

    players = session.query(FantasyPlayer).all()
    teams = session.query(FantasyTeam).all()
    return render_template('update_performance.html', players=players, teams=teams)

if __name__ == '__main__':
    app.run(debug=True)
