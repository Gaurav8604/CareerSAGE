# -*- encoding: utf-8 -*-

from apps.home import blueprint
from flask import render_template, request
from flask_login import login_required
from jinja2 import TemplateNotFound


@blueprint.route('/index')
# @login_required
def index():

    return render_template('home/index.html', segment='index')



@blueprint.route('/<template>')
# @login_required
def route_template(template):

    try:

        if not template.endswith('.html'):
            template += '.html'

        # Detect the current page
        segment = get_segment(request)

        # Serve the file (if exists) from app/templates/home/FILE.html
        return render_template("home/" + template, segment=segment)

    except TemplateNotFound:
        return render_template('home/page-404.html'), 404

    except:
        return render_template('home/page-500.html'), 500
# Helper - Extract current page name from request
def get_segment(request):

    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment

    except:
        return None


@blueprint.route('/games/<filename>')
# @login_required
def subfolder_page(filename):
    try:
        segment = get_segment(request)
        return render_template(f'home/games/{filename}.html', segment=segment)
    except TemplateNotFound:
        return render_template('home/page-404.html'), 404
    except Exception as e:
        return render_template('home/page-500.html'), 500



from flask import jsonify, request
import os
import pandas as pd
import random
import json
    
class main_class:

    def __init__(self):
        self.i=0
        current_folder = os.path.dirname(__file__)
        self.path = os.path.join(current_folder, '..','static\\assets\\questions')
        self.df=pd.read_csv(self.path+"\\Questions_Main.csv")
        self.df = self.df.sample(n=20,random_state=random.randint(0,50))
        self.genre="Adventure"
        self.score=[0,0,0,0]
        self.genre_id=0
        self.careers_in_genre=[]
        self.final_quiz_score=0
        self.career_prob=[
            ['XXXXXXXXXX',0.00000],
            ['XXXXXXXXXX',0.00000],
            ['XXXXXXXXXX',0.00000]
        ]
        self.name="Gaurav Suresh Patil"
        self.class_name="10th C"
        self.marks="91.40"
        self.hobbies="Cycling, Trekking"

    def get_name(self):
        return self.name
    
    def set_name(self,name):
        self.name=name

    def get_class_name(self):
        return self.class_name
    
    def set_class_name(self,class_name):
        self.class_name=class_name

    def get_marks(self):
        return self.marks
    
    def set_marks(self,marks):
        self.marks=marks

    def get_hobbies(self):
        return self.hobbies
    
    def set_hobbies(self,hobbies):
        self.hobbies=hobbies

    def get_index(self):
        return self.i
    
    def put_index(self,z):
        self.i=z
    
    def get_data_frame(self):
        return self.df
    
    def put_data_frame(self,df):
        self.df=df
        self.df.to_csv(self.path+"\\Questions_Answers.csv",index=False)
    
    def get_answer_data_frame(self):
        return pd.read_csv(self.path+"\\Questions_Answers.csv")

    def get_genre(self):
        return self.genre
    
    def put_game_genre(self,genre):
        self.genre=genre
    
    def get_game_score(self):
        return self.score
    
    def put_game_score(self,score):
        self.score=score

    def put_genre_mapping(self,df):
        df.to_csv(self.path+"\\Genre_mapping.csv",index=False)

    def get_genre_mapping(self):
        return pd.read_csv(self.path+"\\Genre_mapping.csv")

    def put_trends_data(self,df):
        df.to_csv(self.path+"\\Trends.csv",index=False)
    
    def get_trends_data(self):
        return pd.read_csv(self.path+"\\Trends.csv")

    def get_genre_id(self):
        return self.genre_id
    
    def get_careers_in_genre(self):
        return self.careers_in_genre
    
    def put_genre_id(self,genre_id):
        self.genre_id=genre_id
    
    def put_careers_in_genre(self,careers_in_genre):
        self.careers_in_genre=careers_in_genre

    def get_final_quiz_score(self):
        return self.final_quiz_score
    
    def put_final_quiz_score(self,final_quiz_score):
        self.final_quiz_score=final_quiz_score
    
    def get_career_prob(self):
        return self.career_prob

    def put_career_prob(self,career_prob):
        self.career_prob=career_prob    

@blueprint.route('/get_all_data', methods=['POST'])
def get_all_data():
    return jsonify({'name':obj.get_name(),'class':obj.get_class_name(),'marks':obj.get_marks(),'hobbies':obj.get_hobbies(),'careers':obj.get_career_prob(),'question_answer':obj.get_data_frame().reset_index().to_dict(),'genre':obj.get_genre(),'game_score':obj.get_game_score(),'games':get_game_list(obj.get_genre()),'quiz_score':obj.get_final_quiz_score()})

@blueprint.route('/set_user_data', methods=['POST'])
def set_user_data():
    print('Called')
    data=request.get_json()
    if data is not None:
        obj.set_name(data.get('name','0'))
        obj.set_class_name(data.get('class','0'))
        obj.set_marks(data.get('marks','0'))
        obj.set_hobbies(data.get('hobbies','0'))
    return jsonify({'resp':'DONE'})

@blueprint.route('/questions', methods=['POST'])
def questions():
    df=obj.get_data_frame()
    df.fillna('', inplace=True)
    return jsonify({'data':df.to_dict('records')})

@blueprint.route('/get_table', methods=['POST'])
def get_table():
    obj.put_data_frame(pd.DataFrame(request.get_json()))
    return jsonify({'data':'OK'})

@blueprint.route('/set_table',methods=['POST'])
def set_table():
    df=obj.get_data_frame()
    df.fillna('', inplace=True)
    return jsonify({'data':df.to_dict('records')})

@blueprint.route('/submit_questions',methods=['POST'])
def submit_questions():
    obj.put_data_frame(pd.DataFrame(request.get_json()))
    genre=genre_predict()
    obj.put_game_genre(genre)
    return jsonify({"resp":"DONE"})

@blueprint.route('/get_game_info',methods=['POST'])
def get_game_info():
    genre=obj.get_genre()
    # genre="Sports"
    # genre="Adventure"
    # genre="Logical"
    return jsonify({'genre':genre,'games_list':get_game_list(genre)})

@blueprint.route('/send_scores',methods=['POST'])
def send_scores():
    data = request.get_json()
    score=[0,0,0,0]
    if data is not None:
        score[0] = data.get('earned_score', 0)
        score[1] = data.get('total_score', 1)
        if(score[1]==0):
            score[2]=0
        elif(score[0]>=score[1]):
            score[2]=98
        else:
            score[2] = (score[0]/score[1]) * 100
        score[3]=score[2]-random.randint(1,10)
        if(score[3]<=0):
            score[3]=random.randint(1,20)
        obj.put_game_score(score)
    return jsonify({'score':obj.get_game_score()})

@blueprint.route('/get_score_quiz_info',methods=['POST'])
def get_score_quiz_info():
    genre_id, careers_in_genre=get_career_path()
    obj.put_genre_id(genre_id)
    obj.put_careers_in_genre(careers_in_genre)
    return jsonify({'resp':'DONE'})

@blueprint.route('/get_url_params_for_api',methods=['POST'])
def get_url_params_for_api():
    scr=obj.get_game_score()[2]
    difficulty="easy"
    if(scr>75):
        difficulty="hard"
    elif(scr>40):
        difficulty="medium"
    return jsonify({'genre_id':obj.get_genre_id(),'difficulty':difficulty})

@blueprint.route('/compute_final_result',methods=['POST'])
def compute_final_result():
    data=request.get_json()
    if data is not None :
        obj.put_final_quiz_score(data)

    # obj.put_career_prob([
    #     ['Astronomer',46.685244],
    #     ['Field Biologist',39.576096],
    #     ['Spot Guide',5.738660]
    # ])

    # return jsonify({'resp':'DONE'})

    import requests
    from bs4 import BeautifulSoup
    from pytrends.request import TrendReq
    import time
    import pandas as pd

    # Function to scrape job listings from a specific website
    def scrape_job_listings_from_linkedin(keyword):
        url = f'https://www.linkedin.com/jobs/{keyword}'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        job_titles = soup.find_all('h3', class_='job-card-title') # Update class based on LinkedIn's HTML structure
        return [title.text.strip() for title in job_titles]

    # Function to fetch search trends using Google Trends API with manual error handling and retries
    def fetch_search_trends(keywords):
        attempts = 3
        for attempt in range(attempts):
            try:
                pytrends = TrendReq(hl='en-US', tz=360)
                pytrends.build_payload(keywords, timeframe='today 3-m') # Adjust timeframe as needed
                trends_data = pytrends.interest_over_time()
                return trends_data
            except Exception as e:
                print("Error fetching search trends:", e)
                if attempt < attempts - 1:
                    print("Retrying after 10 seconds...")
                    time.sleep(10)
                else:
                    print("Max retry attempts reached. Exiting...")
                    return None

    # Function to scrape job listings for given careers from multiple websites
    def scrape_job_listings(matching_careers_in_genre):
        websites = ['linkedin']  # Add more websites here if needed

        all_jobs = {}
        for website in websites:
            jobs = []
            for career in matching_careers_in_genre:
                if website == 'linkedin':
                    jobs.extend(scrape_job_listings_from_linkedin(career))
            all_jobs[website] = jobs
        return all_jobs

    # Example usage
    matching_careers_in_genre = obj.get_careers_in_genre()  # Example list of careers
    jobs_data = scrape_job_listings(matching_careers_in_genre)

    trends_data = fetch_search_trends(matching_careers_in_genre)

    # Convert dictionaries to DataFrames
    trends_df = pd.DataFrame(trends_data)

    # Write DataFrames to CSV files
    obj.put_trends_data(trends_df)

    import pandas as pd

    # Load trends data from CSV file into a DataFrame
    trends_df = obj.get_trends_data()

    # Remove the 'isPartial' column if it's present
    if 'isPartial' in trends_df.columns:
        trends_df.drop(columns=['isPartial'], inplace=True)

    # Multiply each column by the aptitude score
    trends_df *= data

    # Calculate the sum of all columns excluding the date column
    column_sum = trends_df.sum(axis=1)

    # Calculate the percentage of each column with respect to the sum of other columns
    percentage_df = trends_df.div(column_sum, axis=0) * 100

    # Calculate the average percentage for each column
    average_percentage = percentage_df.mean()

    # Output the average percentage
    # print(average_percentage)
    obj.put_career_prob([
        [matching_careers_in_genre[0],average_percentage[0]],
        [matching_careers_in_genre[1],average_percentage[1]],
        [matching_careers_in_genre[2],average_percentage[2]]
    ])

    return jsonify({'resp':'DONE'})

@blueprint.route('/get_final_report',methods=['POST'])
def get_final_report():
    return jsonify({'careers':obj.get_career_prob()})




def get_game_list(genre):
    if(genre=='Artistic' or genre=='Logical'):
        return ["chess","sudoku"];
    elif(genre=='Adventure'):
        return ['dodge_a_wrench','highway_rider']
    elif(genre=='Sports'):
        return ['foosball','8_ball_pool']
    else:
        return ['chess','sudoku']

def genre_predict():
    import pandas as pd
    import numpy as np
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    from sklearn.feature_extraction.text import CountVectorizer
    from nltk.stem import WordNetLemmatizer

    nltk.download('averaged_perceptron_tagger')
    nltk.download('wordnet')
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('averaged_perceptron_tagger')

    data=obj.get_answer_data_frame()

    def remove_negative_rows(data):
        negative_keywords = ['not', 'don\'t', 'dislike', 'no', 'never']
        negative_mask = data['Answers'].apply(lambda x: any(keyword in x.lower() for keyword in negative_keywords))
        data = data[~negative_mask]
        return data

    data = pd.DataFrame(data)

    df = remove_negative_rows(data)

    lemmatizer = WordNetLemmatizer()

    def preprocess_text_remove_negative(text, df):
        tokens = word_tokenize(text)
        lammatized_words = [lemmatizer.lemmatize(word) for word in tokens]
        lemmatized_text = ' '.join(lammatized_words)
        return lemmatized_text


    df['Answers'] = df['Answers'].apply(preprocess_text_remove_negative, args=(df,))


    df['Answers'] = df['Answers'].replace('', np.nan)
    df['Questions'] = df['Questions'].replace('', np.nan)
    df = df.dropna()

    def lemmatize_word(word):
        return lemmatizer.lemmatize(word.lower())

    def is_artistic(word):
        Art = [ 'art','music', 'drawing', 'dance', 'painting', 'colours', 'craft', 'acting', 'plays', 'concerts',
                "painting", "sculpture", "drawing", "sketch", "canvas", "palette", "brush", "easel",
                "portrait", "landscape", "abstract", "impressionism", "expressionism", "realism",
                "modern art", "contemporary art", "gallery", "museum", "exhibition", "artist", "creator",
                "artistic", "creative", "composition", "color palette", "artwork", "craftsmanship",
                "fine art", "visual art", "masterpiece", "critique", "aesthetics", "artistic expression",
                "ceramics", "pottery", "scenic design", "fresco", "carving", "engraving", "photography",
                "graphic design", "mixed media", "collage", "stencil", "illustration", "conceptual art",
                "art history", "art criticism", "artistic process", "art studio", "art therapy", "art form",
                "art movement", "art market", "art collector", "public art", "installation art", "street art",
                "artistic style", "palette knife", "still life", "impressionist", "cubism", "surrealism",
                "minimalism", "pop art", "abstract expressionism", "art deco", "renaissance", "baroque",
                "modernism", "postmodernism", "contour drawing", "hues", "tones", "shades", "shadows",
                "perspective", "symmetry", "asymmetry", "balance", "contrast", "composition", "texture",
                "instrument", "music", "melody", "harmony", "rhythm", "tune", "note",
                "guitar", "piano", "violin", "cello", "flute", "trumpet", "saxophone",
                "drum", "percussion", "accordion", "harp", "clarinet", "bass", "ukelele",
                "trombone", "harmonica", "mandolin", "banjo", "keyboard", "synthesizer",
                "xylophone", "marimba", "harpsichord", "organ", "bagpipes", "djembe",
                "conga", "bongo", "tabla", "maracas", "tambourine", "glockenspiel",
                "oboe", "fiddle", "french horn", "trumpet", "cymbal", "castanets",
                "triangle", "metronome", "flugelhorn", "piccolo", "sitar", "accordion",
                "clavichord", "zither", "gong", "didgeridoo", "theremin", "maraca"]
        
        return any(lemmatize_word(keyword) in lemmatize_word(word) for keyword in Art)


    def is_logical(word):
        Logical = ["mathematics", "math", "algebra", "geometry", "calculus", "trigonometry",
                "science", "physics", "chemistry", "biology", "geology", "astronomy",
                "history", "geography", "social studies", "english", "literature",
                "computer science", "programming", "coding", "technology", "engineering",
                "books", "education", "learning", "teaching", "school", "classroom", "teacher", "student", "curriculum",
                "subject", "lesson", "class", "study", "textbook", "knowledge", "skill", "academic", "degree",
                "major", "minor", "assignment", "study", "learn", "teach", "class", "lesson", "homework", "exam", "test",
                "student", "teacher", "school", "college", "university", "degree", "academic",
                "number", "variable", "equation", "function", "graph", "probability", "statistics",
                "derivative", "integral", "formula", "theorem", "hypothesis", "experiment",
                "hypothesis", "experiment", "observation", "laboratory", "chemical", "element",
                "molecule", "cell", "dna", "evolution", "ecology", "solar system", "galaxy",
                "algorithm", "data", "programming language", "code", "software", "hardware",
                "algorithm", "database", "network", "artificial intelligence", "machine learning",
                "innovation", "design", "prototype", "engineering", "robotics", "automation",
                "literary", "novel", "poetry", "prose", "essay", "author", "plot", "character",
                "knowledge", "education", "intellectual", "cognitive", "curriculum", "interactive",
                "critical thinking", "analytical", "research", "reading", "writing", "discussion",
                "discovery", "understanding", "problem-solving", "creativity",'language','vocabulary','debate','astronaut','strategy']

        return any(lemmatize_word(keyword) in lemmatize_word(word) for keyword in Logical)


    def is_adventure(word):
        adventure = ["journey", 'challenging', "exploration", "quest", "expedition", "excursion",
                    "voyage", "explorer", "traveler", "adventurer", "trek",
                    "odyssey", "pilgrimage", "quest", "discovery", "enterprise",
                    "undertaking", "explore", "discover", "roam", "wander",
                    "trekking", "hike", "trail", "traverse", "jaunt",
                    "ramble", "perambulation", "safari", "sail", "explore",
                    "conquer", "navigate", "wanderlust", "cruise", "safari",
                    "excursion", "jaunt", "thrill", "risk", "challenge",
                    "bravery", "courage", "boldness", "daring", "venture",
                    "experience", "daring", "risk-taking", "questing", "intrepid",
                    "fearless", "courageous", "epic", "adrenaline", "trailblazer",
                    "rover", "pioneer", "trailblazing", "discovery", "pursuit",
                    "pilgrim", "sojourner", "odyssey", "epic", "bold",
                    "exploratory", "footprints", "map", "compass", "climb",
                    "summit", "peak", "wilderness", "landscape", "horizon",'vacation','movie']

        return any(lemmatize_word(keyword) in lemmatize_word(word) for keyword in adventure)


    def is_sports(word):
        sports = ["sport","soccer", "football", "basketball", "tennis", "volleyball", "baseball", "softball",
                    "hockey", "cricket", "golf", "rugby", "badminton", "table tennis", "swimming",
                    "cycling", "running", "jogging", "marathon", "sprinting", "skiing", "snowboarding",
                    "skating", "surfing", "climbing", "hiking", "yoga", "pilates", "gymnastics",
                    "weightlifting", "bodybuilding", "aerobics", "crosstraining", "zumba", "boxing",
                    "karate", "martial arts", "wrestling", "fencing", "archery", "shooting", "angling",
                    "cycling", "karate", "taekwondo", "judo", "paddleboarding", "kayaking", "canoeing",
                    "rowing", "sailing", "mountaineering", "rock climbing", "bouldering",

                    # Fitness and Exercise
                    "exercise", "workout", "training", "fitness", "wellness", "health", "nutrition",
                    "hydration", "stretching", "warm-up", "cool-down", "cardio", "strength",
                    "endurance", "flexibility", "balance", "core", "muscles", "reps", "sets",
                    "intervals", "resistance", "aerobic", "anaerobic", "rest", "recovery", "hydration",
                    "calories", "protein", "carbohydrates", "hydration", "metabolism", "burn", "sweat",
                    "hydration", "hydration", 

                    # Indoor Sports and Games
                    "chess", "checkers", "table tennis", "billiards", "pool", "snooker", "darts",
                    "video games", "board games", "card games", "puzzles", "indoor cycling",
                    "indoor rowing", "indoor climbing", "bowling", "gym", "treadmill", "elliptical",

                    # Outdoor Activities
                    "outdoor sports", "outdoor games", "outdoor fitness", "camping", "hiking",
                    "trail running", "outdoor yoga", "picnic", "fishing", "gardening", "beach volleyball",
                    "parkour", "frisbee", "outdoor climbing", "biking", "cycling", "running trails",
                    "outdoor gym", "street workout", "rollerblading", "skateboarding", "scootering",
                    "stadium stairs", "outdoor adventure", "adventure sports", "obstacle course",
                    "orienteeering", "geocaching", "survival skills", "wilderness activities",
                    "outdoor exploration"]

        return any(lemmatize_word(keyword) in lemmatize_word(word) for keyword in sports)

    df['Genre'] = df['Answers'].apply(
        lambda x: 'Artistic' if any(is_artistic(word) for word in x.split()) else (
            'Logical' if any(is_logical(word) for word in x.split()) else (
                'Adventure' if any(is_adventure(word) for word in x.split()) else (
                    'Sports' if any(is_sports(word) for word in x.split()) else 'Other')
            )
        )
    )
    most_frequent_genre = df['Genre'].mode()[0]
    obj.put_genre_mapping(df)
    return most_frequent_genre


def get_career_path():
    # return 17, ['Astronomer', 'Field Biologist', 'Spot Guide']
    import pandas as pd
    import numpy as np
    import nltk
    from nltk.tokenize import word_tokenize
    from nltk.tag import pos_tag
    import nltk
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('averaged_perceptron_tagger')
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    from sklearn.feature_extraction.text import CountVectorizer
    from nltk.stem import WordNetLemmatizer
    import gensim.downloader as api
    from itertools import combinations
    from sklearn.metrics.pairwise import cosine_similarity
    nltk.download('averaged_perceptron_tagger')
    nltk.download('wordnet')

    df = obj.get_genre_mapping()
    from nltk.stem import PorterStemmer
    from collections import Counter

    # Calculate frequency of each genre
    genre_freq = df['Genre'].value_counts()

    # Identify genre with the highest frequency
    highest_freq_genre = genre_freq.idxmax()

    # Filter dataset to keep only rows with the highest frequency genre
    filtered_df = df[df['Genre'] == highest_freq_genre]
    # Function to extract nouns using NLTK
    def extract_nouns(text):
        nouns = []
        for word, pos in pos_tag(word_tokenize(text)):
            if pos.startswith('NN'):
                nouns.append(word)
        return nouns
    filtered_df['Nouns'] = filtered_df['Answers'].apply(extract_nouns)
    all_nouns = [noun for sublist in filtered_df['Nouns'] for noun in sublist]

    word2vec_model = api.load("word2vec-google-news-300")
    similar_words = []
    for combo in combinations(all_nouns, 3):  # Change 3 to the desired number of words in a combination
        if all(word in word2vec_model.key_to_index for word in combo):
            vectors = [word2vec_model.get_vector(word) for word in combo]
            similarity = cosine_similarity(vectors)
            average_similarity = similarity.mean()
            similar_words.append((combo, average_similarity))
    similar_words.sort(key=lambda x: x[1], reverse=True)
    max_similarity = 0
    best_combination = None

    for combo, similarity in similar_words:
        if similarity > max_similarity:
            max_similarity = similarity
            best_combination = combo

    careers_domains = {
        'Art Director': ['art', 'creativity', 'leadership'],
        'Musician': ['music', 'music', 'performer'],
        'Composer': ['music', 'composition', 'musician'],
        'Music Teacher': ['music', 'education', 'instructor'],
        'Painter': ['paint', 'paint', 'artist'],
        'Sculptor': ['art', 'sculpture', 'artist'],
        'Graphic Designer': ['art', 'graphic design', 'creative'],
        'Sound Engineer': ['music', 'technology', 'engineering'],
        'Illustrator': ['art', 'illustration', 'artist'],
        'Comic Artist': ['art', 'comics', 'artist'],
        'Storyboard Artist': ['art', 'storytelling', 'artist'],
        'Dancer': ['dance', 'perform', 'movement'],
        'Choreographer': ['dance', 'choreography', 'creativity'],
        'Dance Instructor': ['dance', 'education', 'instructor'],
        'Art Dealer': ['art', 'business', 'sales'],
        'Curator': ['art', 'curation', 'museum'],
        'Museum Educator': ['art', 'education', 'museum'],
        'Craftsman': ['art', 'craftsmanship', 'creator'],
        'Artisan': ['art', 'craft', 'creator'],
        'Actor': ['acting', 'perform', 'theater'],
        'Actress': ['acting', 'perform', 'theater'],
        'Theatre Director': ['acting', 'direct', 'theater'],
        'Opera Singer': ['music', 'opera', 'performer'],
        'Jazz Musician': ['music', 'jazz', 'performer'],
        'Blues Musician': ['music', 'blues', 'performer'],
        'Rock Musician': ['music', 'rock', 'performer'],
        'Country Musician': ['music', 'country', 'performer'],
        'Folk Musician': ['music', 'folk', 'performer'],
        'Rapper': ['music', 'rap', 'performer'],
        'Hip-Hop Artist': ['music', 'hip-hop', 'performer'],
        'Electronic Musician': ['music', 'electronic', 'performer'],
        'Folk Musician': ['music', 'folk', 'performer'],
        'Bluegrass Musician': ['music', 'bluegrass', 'performer'],
        'Heavy Metal Musician': ['music', 'heavy metal', 'performer'],
        'Techno Musician': ['music', 'techno', 'performer'],
        'Acoustic Musician': ['music', 'acoustic', 'performer'],
        'Theremin Player': ['music', 'theremin', 'performer'],
        'Maraca Player': ['music', 'percussion', 'performer'],
        'Mathematician': ['mathematics', 'mathematician', 'theory'],
        'Math Teacher': ['mathematics', 'education', 'instructor'],
        'Algebraist': ['mathematics', 'algebra', 'theory'],
        'Geometry Teacher': ['mathematics', 'education', 'instructor'],
        'Calculus Teacher': ['mathematics', 'education', 'instructor'],
        'Trigonometry Teacher': ['mathematics', 'education', 'instructor'],
        'Physicist': ['science', 'physics', 'researcher'],
        'Chemist': ['science', 'chemistry', 'researcher'],
        'Biologist': ['science', 'biology', 'researcher'],
        'Geologist': ['science', 'geology', 'researcher'],
        'Astronomer': ['science', 'astronomy', 'researcher'],
        'Historian': ['history', 'researcher', 'academia'],
        'Geographer': ['geography', 'researcher', 'maps'],
        'Social Studies Teacher': ['social studies', 'education', 'instructor'],
        'Lesson Planner': ['education', 'planning', 'curriculum'],
        'Classroom Teacher': ['education', 'teacher', 'instruction'],
        'Study Specialist': ['education', 'specialist', 'learning'],
        'Textbook Author': ['education', 'authorship', 'textbooks'],
        'Knowledge Analyst': ['education', 'analysis', 'knowledge'],
        'Skill Trainer': ['education', 'training', 'skills'],
        'Academic Advisor': ['education', 'advising', 'academia'],
        'Degree Advisor': ['education', 'advising', 'academia'],
        'Major Specialist': ['education', 'specialization', 'academia'],
        'Minor Specialist': ['education', 'specialization', 'academia'],
        'Assignment Planner': ['education', 'planning', 'assignments'],
        'Formula Developer': ['mathematics', 'development', 'equations'],
        'Theorem Prover': ['mathematics', 'proof', 'theory'],
        'Hypothesis Tester': ['science', 'testing', 'hypothesis'],
        'Experiment Designer': ['science', 'design', 'experimentation'],
        'Observation Analyst': ['science', 'analysis', 'observation'],
        'Laboratory Scientist': ['science', 'laboratory', 'research'],
        'Chemical Engineer': ['engineering', 'chemistry', 'design'],
        'Element Specialist': ['science', 'elements', 'specialist'],
        'Molecular Biologist': ['science', 'biology', 'molecules'],
        'Cell Biologist': ['science', 'biology', 'cells'],
        'Geneticist': ['science', 'genetics', 'researcher'],
        'Evolutionary Biologist': ['science', 'biology', 'evolution'],
        'Ecologist': ['science', 'ecology', 'researcher'],
        'Astronaut': ['astronaut', 'space', 'exploration'],
        'Solar System Researcher': ['science', 'astronomy', 'researcher'],
        'Galaxy Researcher': ['science', 'astronomy', 'researcher'],
        'Algorithm Designer': ['technology', 'algorithms', 'design'],
        'Data Analyst': ['technology', 'analysis', 'data'],
        'Programming Language Specialist': ['technology', 'programming', 'languages'],
        'Robotics Engineer': ['technology', 'robotics', 'engineering'],
        'Automation Specialist': ['technology', 'automation', 'specialist'],
        'Author': ['literature', 'authorship', 'writing'],
        'Novelist': ['literature', 'authorship', 'writing'],
        'Poet': ['literature', 'poetry', 'writing'],
        'Prose Writer': ['literature', 'prose', 'writing'],
        'Essayist': ['literature', 'essays', 'writing'],
        'Literary Critic': ['literature', 'criticism', 'analysis'],
        'Character Designer': ['literature', 'character design', 'creation'],
        'Language Specialist': ['language', 'specialist', 'linguistics'],
        'Vocabulary Instructor': ['language', 'education', 'vocabulary'],
        'Debater': ['communication', 'debate', 'argumentation'],
        'Astronaut': ['astronaut', 'space', 'exploration'],
        'Strategist': ['strategy', 'planning', 'leadership'],
        'Explorer': ['exploration', 'adventurer', 'discovery'],
        'Traveler': ['travel', 'adventure', 'exploration'],
        'Adventurer': ['adventure', 'exploration', 'daring'],
        'Trekking Guide': ['adventure', 'guide', 'trek'],
        'Archaeologist': ['archaeology', 'research', 'excavation'],
        'Marine Biologist': ['science', 'biology', 'marine'],
        'Environmental Scientist': ['science', 'environment', 'researcher'],
        'Ethnographer': ['anthropology', 'research', 'culture'],
        'Anthropologist': ['anthropology', 'research', 'culture'],
        'Historical Preservationist': ['history', 'preservation', 'conservation'],
        'Adventure Travel Agent': ['travel', 'adventure', 'agency'],
        'Ecotourism Coordinator': ['travel', 'ecotourism', 'coordination'],
        'Cultural Exchange Coordinator': ['culture', 'exchange', 'coordination'],
        'Adventure Race Coordinator': ['adventure', 'race', 'coordination'],
        'Wilderness First Responder': ['emergency', 'wilderness', 'response'],
        'Search and Rescue Specialist': ['emergency', 'search and rescue', 'specialist'],
        'Environmental Educator': ['education', 'environment', 'instructor'],
        'Adventure Therapy Guide': ['adventure', 'therapy', 'guide'],
        'Wilderness Medicine Instructor': ['medicine', 'wilderness', 'instructor'],
        'Canopy Tour Guide': ['adventure', 'guide', 'canopy'],
        'Glacier Guide': ['adventure', 'guide', 'glacier'],
        'Polar Explorer': ['exploration', 'polar', 'adventurer'],
        'Desert Guide': ['adventure', 'guide', 'desert'],
        'Jungle Expedition Leader': ['adventure', 'leader', 'jungle'],
        'Mountain Bike Guide': ['adventure', 'guide', 'mountain bike'],
        'Rock Climbing Guide': ['adventure', 'guide', 'rock climb'],
        'Backpacking Guide': ['adventure', 'guide', 'backpack'],
        'Whale Watching Guide': ['adventure', 'guide', 'whale watch'],
        'Outdoor Adventure Camp Counselor': ['adventure', 'camp', 'counselor'],
        'Bird Watching Guide': ['adventure', 'guide', 'bird watch'],
        'Field Biologist': ['science', 'biology', 'field'],
        'Adventure Tourism Researcher': ['adventure', 'tourism', 'researcher'],
        'Adventure Travel Writer': ['adventure', 'travel', 'writing'],
        'Eco-travel Specialist': ['travel', 'eco-friendly', 'specialist'],
        'Outdoor Leadership Trainer': ['adventure', 'leadership', 'training'],
        'Trail Maintenance Worker': ['outdoors', 'maintenance', 'trail'],
        'Outdoor Adventure Programmer': ['adventure', 'programming', 'organization'],
        'Adventure Travel Planner': ['adventure', 'travel', 'planning'],
        'Nature Guide': ['nature', 'guide', 'outdoors'],
        'Eco-volunteer Coordinator': ['eco-friendly', 'volunteering', 'coordination'],
        'Conservation Worker': ['conservation', 'environment', 'worker'],
        'Tourism Marketing Specialist': ['tourism', 'marketing', 'specialist'],
        'Adventure Education Instructor': ['adventure', 'education', 'instructor'],
        'Boxing Trainer': ['sport', 'boxing', 'training'],
        'Martial Arts Instructor': ['sport', 'martial arts', 'instructor'],
        'Wrestling Coach': ['sport', 'wrestling', 'coaching'],
        'Outdoor Adventure Guide': ['adventure', 'guide', 'outdoors'],
        'Mountain Guide': ['adventure', 'guide', 'mountain'],
        'Rock Climbing Instructor': ['adventure', 'instructor', 'rock climb'],
        'Hiking Guide': ['adventure', 'guide', 'hike'],
        'Wilderness Survival Instructor': ['survival', 'instructor', 'wilderness'],
        'Outdoor Education Instructor': ['education', 'outdoor', 'instructor'],
        'Adventure Therapy Guide': ['adventure', 'therapy', 'guide'],
        'Outdoor Fitness Trainer': ['fitness', 'outdoor', 'trainer'],
        'Cycling Coach': ['sport', 'cycling', 'coaching'],
        'Kayaking Instructor': ['sport', 'kayaking', 'instructor'],
        'Canoeing Instructor': ['sport', 'canoeing', 'instructor'],
        'Rowing Coach': ['sport', 'rowing', 'coaching'],
        'Sailing Instructor': ['sport', 'sailing', 'instructor'],
        'Outdoor Adventure Photographer': ['adventure', 'photography', 'outdoors']
    }


    list(careers_domains.keys())

    def find_matching_career(words, careers_domains, top_n=3):
        matching_careers = []

        for career, domains in careers_domains.items():
            matches = sum(word in domains for word in words)
            matching_careers.append((career, matches))

        matching_careers.sort(key=lambda x: x[1], reverse=True)
        top_matching_careers = matching_careers[:top_n]

        return [career for career, _ in top_matching_careers]

    matching_careers = find_matching_career(best_combination, careers_domains, top_n=3)

    genre_careers_mapping = {
        9: ['Historian', 'Geographer', 'Social Studies Teacher', 'Lesson Planner', 'Academic Advisor', 'Knowledge Analyst', 'Skill Trainer'],
        10: ['Author', 'Novelist', 'Poet', 'Prose Writer', 'Essayist', 'Literary Critic'],
        11: ['Actor', 'Actress', 'Film Director', 'Screenwriter', 'Cinematographer', 'Film Editor'],
        12: ['Musician', 'Composer', 'Music Teacher', 'Sound Engineer', 'Jazz Musician', 'Blues Musician', 'Rock Musician', 'Country Musician', 'Folk Musician', 'Rapper', 'Hip-Hop Artist', 'Electronic Musician', 'Bluegrass Musician', 'Heavy Metal Musician', 'Techno Musician', 'Acoustic Musician', 'Theremin Player', 'Maraca Player'],
        13: ['Theatre Director', 'Actor', 'Actress', 'Opera Singer', 'Choreographer', 'Dancer', 'Dance Instructor'],
        14: ['Television Actor', 'Television Actress', 'Television Director', 'Television Producer', 'Television Writer', 'Television Host'],
        15: ['Game Developer', 'Game Designer', 'Game Artist', 'Game Tester', 'Game Producer', 'Game Writer'],
        16: ['Game Developer', 'Game Designer', 'Game Artist', 'Game Tester', 'Game Producer', 'Game Writer'],
        17: ['Biologist', 'Geologist', 'Astronomer', 'Ecologist', 'Marine Biologist', 'Environmental Scientist', 'Field Biologist'],
        18: ['Computer Scientist', 'Software Engineer', 'Computer Programmer', 'Web Developer', 'Database Administrator', 'Network Engineer'],
        19: ['Mathematician', 'Math Teacher', 'Algebraist', 'Geometry Teacher', 'Calculus Teacher', 'Trigonometry Teacher'],
        20: ['Mythologist', 'Folklorist'],
        21: ['Athlete', 'Coach', 'Sports Journalist', 'Sports Agent', 'Sports Commentator', 'Sports Broadcaster'],
        22: ['Geographer', 'Cartographer', 'GIS Specialist'],
        23: ['Historian', 'Archaeologist', 'Historical Preservationist'],
        24: ['Politician', 'Political Scientist', 'Political Analyst', 'Political Consultant'],
        25: ['Painter', 'Sculptor', 'Graphic Designer', 'Art Director', 'Illustrator', 'Comic Artist', 'Storyboard Artist', 'Craftsman', 'Artisan'],
        26: ['Actor', 'Actress', 'Musician', 'Composer', 'Author', 'Director', 'Producer'],
        27: ['Veterinarian', 'Zoologist', 'Animal Behaviorist'],
        28: ['Automotive Engineer', 'Mechanic', 'Car Designer', 'Test Driver', 'Fleet Manager', 'Auto Electrician'],
        29: ['Comic Artist', 'Illustrator', 'Cartoonist', 'Storyboard Artist'],
        30: ['Electrical Engineer', 'Mechanical Engineer', 'Robotics Engineer', 'Automation Specialist', 'Chemical Engineer', 'Electronics Technician'],
    }


    def find_matching_genre(matching_careers, genre_careers_mapping):
        genre_matches = {genre_id: [career for career in matching_careers if career in careers_list] for genre_id, careers_list in genre_careers_mapping.items()}
        max_matches_genre_id = max(genre_matches, key=lambda x: len(genre_matches[x]))
        matching_careers_in_genre = genre_matches[max_matches_genre_id]
        return max_matches_genre_id, matching_careers_in_genre

    matching_genre_id, matching_careers_in_genre = find_matching_genre(matching_careers, genre_careers_mapping)

    print("Matching genre ID:", matching_genre_id)
    print("Matching careers in genre:", matching_careers_in_genre)
    return matching_genre_id, matching_careers_in_genre


obj=main_class()

