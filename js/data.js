// Particle Hunter Data
// All sentence banks, vocabulary, and reference data

// Core sentence bank
var CORE = [
  {text: "私は日本語を勉強している。"},
  {text: "明日学校でテストがある。"},
  {text: "駅まで歩いて行く。"},
  {text: "友達と映画を見た。"},
  {text: "図書館で本を借りた。"},
  {text: "昼ご飯にカレーを食べた。"},
  {text: "猫が庭にいる。"},
  {text: "東京へ引っ越した。"},
  {text: "七時に起きて、会社へ行く。"},
  {text: "この本は太郎にあげた。"},
  {text: "親より背が高い。"},
  {text: "牛乳しか飲まない。"},
  {text: "駅から家まで走った。"},
  {text: "先生とも話した。"},
  {text: "日本の文化について学ぶ。"},
  {text: "明日も仕事がある。"},
  {text: "これは私のです。"},
  {text: "公園で子供と遊ぶ。"}
];

// Trap sentences with exceptions
var TRAPS = [
  {text: "にんじんを食べる。", exceptions: [{start: 0, end: 1}]},
  {text: "ノートにのりをつけた。", exceptions: [{start: 4, end: 5}]},
  {text: "できるだけ早く帰る。", exceptions: [{start: 0, end: 1}]},
  {text: "この本を読んだ。", exceptions: [{start: 0, end: 2}]},
  {text: "その映画は面白い。", exceptions: [{start: 0, end: 2}]}
];

// Extended sentence banks by level
var LEVEL1_EXT = [
  {text: "犬が走る。"}, {text: "雨が降る。"}, {text: "花を見る。"}, {text: "水を飲む。"},
  {text: "友達に会う。"}, {text: "学校へ行く。"}, {text: "本が好きだ。"}, {text: "車で来た。"},
  {text: "母と買い物する。"}, {text: "兄も来る。"}, {text: "妹の鞄だ。"}, {text: "家から出る。"},
  {text: "駅まで歩く。"}, {text: "音楽を聞く。"}, {text: "部屋が暗い。"}, {text: "朝ご飯を食べる。"},
  {text: "先生が教える。"}, {text: "絵を描く。"}, {text: "窓を開ける。"}, {text: "友達と遊ぶ。"}
];

var LEVEL2_EXT = [
  {text: "母が料理を作っている。"}, {text: "兄は毎日走っている。"}, {text: "妹も宿題をする。"},
  {text: "犬が公園で遊んでいる。"}, {text: "私は本を図書館で借りた。"}, {text: "友達と映画館へ行った。"},
  {text: "父が会社から帰ってきた。"}, {text: "彼女は日本語が上手だ。"}, {text: "昨日も雨が降った。"},
  {text: "猫が魚を食べている。"}, {text: "弟は学校が嫌いだ。"}, {text: "姉が手紙を書いた。"},
  {text: "彼は東京から来た。"}, {text: "私も歌が好きだ。"}, {text: "先生が本を読んでいる。"},
  {text: "母が買い物に行った。"}, {text: "兄が車を運転する。"}, {text: "友達の家へ行く。"},
  {text: "毎日公園を散歩する。"}, {text: "駅から走って来た。"}
];

var LEVEL3_EXT = [
  {text: "彼は毎朝七時に起きて、会社へ行く。"}, {text: "私の母は料理が上手で、毎日美味しいものを作る。"},
  {text: "友達が図書館で勉強している時、私は家で寝ていた。"}, {text: "兄は東京の大学で経済を勉強している。"},
  {text: "昨日駅前で友達に会って、一緒に映画を見た。"}, {text: "彼女は日本語と英語が話せる。"},
  {text: "父が会社から帰ってきたら、夕飯を食べる。"}, {text: "妹は毎日ピアノを練習しているが、まだ上手ではない。"},
  {text: "公園で犬と遊んでいる子供たちを見た。"}, {text: "明日は友達の家でパーティーがある。"},
  {text: "私は朝ご飯にパンと牛乳を食べた。"}, {text: "彼は本を読むのが好きで、毎週図書館に行く。"},
  {text: "母が買い物から帰ってきて、料理を始めた。"}, {text: "兄が新しい車を買ったので、私も乗せてもらった。"},
  {text: "駅まで歩いて行くより、バスで行く方が早い。"}
];

var LEVEL4_EXT = [
  {text: "私の父は毎朝六時に起きて、会社に行く前にジョギングをしている。"},
  {text: "友達が東京から大阪まで新幹線で行った時、私も一緒に行きたかったが、仕事があって行けなかった。"},
  {text: "彼女は日本語の勉強を始めてから三年になるが、まだ漢字を読むのが難しいと言っている。"},
  {text: "昨日図書館で本を借りようと思ったが、読みたい本が全部貸し出されていたので、諦めて帰った。"},
  {text: "母が料理を作っている間に、私は部屋を掃除して、父は庭で花に水をやっていた。"},
  {text: "兄は大学を卒業してから東京の会社で働いているが、毎週末は実家に帰ってくる。"},
  {text: "彼は日本語が上手に話せるだけではなく、中国語も韓国語も勉強している。"},
  {text: "明日友達と映画を見に行く予定だったが、雨が降りそうなので、家でゲームをすることにした。"},
  {text: "私は朝ご飯を食べてから学校に行くが、弟は食べないで行くので、母がいつも心配している。"},
  {text: "彼女が駅で待っていると言ったので、私は急いで行ったが、彼女はもう帰ってしまっていた。"}
];

// Particle definitions
var MULTI = ["から", "まで", "より", "って", "しか", "など"];
var SINGLE = ["は", "が", "を", "に", "へ", "で", "と", "も", "や", "の"];
var ALL = [].concat(MULTI, SINGLE);

// Particle glosses with plain-language explanations
var GLOSS = {
  "は": "topic marker",
  "が": "subject marker",
  "を": "direct object",
  "に": "target / time / location",
  "へ": "direction (towards)",
  "で": "place of action / means",
  "と": "and / with / quotative",
  "も": "also / even",
  "や": "non-exhaustive 'and'",
  "の": "possessive / nominalizer",
  "から": "from / since",
  "まで": "until / as far as",
  "より": "than (comparison)",
  "しか": "only (with negative)",
  "って": "informal quotative/topic",
  "など": "such as / etc."
};

// Hidden particles that は can replace
var WA_REVEALS = {
  "私は": {hidden: "が", explanation: "私 is the subject (doer), は marks it as the topic"},
  "兄は": {hidden: "が", explanation: "兄 is the subject, は marks it as the topic"},
  "妹は": {hidden: "が", explanation: "妹 is the subject, は marks it as the topic"},
  "母は": {hidden: "が", explanation: "母 is the subject, は marks it as the topic"},
  "父は": {hidden: "が", explanation: "父 is the subject, は marks it as the topic"},
  "彼は": {hidden: "が", explanation: "彼 is the subject, は marks it as the topic"},
  "彼女は": {hidden: "が", explanation: "彼女 is the subject, は marks it as the topic"},
  "犬は": {hidden: "が", explanation: "犬 is the subject, は marks it as the topic"},
  "猫は": {hidden: "が", explanation: "猫 is the subject, は marks it as the topic"},
  "これは": {hidden: "が", explanation: "これ is the subject, は marks it as the topic"},
  "それは": {hidden: "が", explanation: "それ is the subject, は marks it as the topic"},
  "本は": {hidden: "が", explanation: "本 is the subject, は marks it as the topic"}
};

// Comprehensive vocabulary dictionary
var VOCAB = {
  "私": "I/me", "犬": "dog", "雨": "rain", "花": "flower", "水": "water", "友達": "friend", "学校": "school", "本": "book", "車": "car",
  "母": "mother", "兄": "older brother", "妹": "younger sister", "家": "home/house", "駅": "station", "音楽": "music", "部屋": "room",
  "朝ご飯": "breakfast", "先生": "teacher", "絵": "picture", "窓": "window", "料理": "cooking/dish", "毎日": "every day",
  "宿題": "homework", "公園": "park", "図書館": "library", "映画館": "movie theater", "父": "father", "彼女": "she/her",
  "日本語": "Japanese language", "昨日": "yesterday", "猫": "cat", "魚": "fish", "弟": "younger brother", "姉": "older sister",
  "手紙": "letter", "彼": "he/him", "東京": "Tokyo", "歌": "song", "買い物": "shopping", "運転": "driving", "散歩": "walk",
  "毎朝": "every morning", "七時": "7 o'clock", "大学": "university", "経済": "economics", "駅前": "in front of station",
  "一緒": "together", "英語": "English language", "夕飯": "dinner", "ピアノ": "piano", "練習": "practice", "パーティー": "party",
  "パン": "bread", "牛乳": "milk", "毎週": "every week", "新幹線": "bullet train", "大阪": "Osaka", "三年": "3 years", "漢字": "kanji",
  "仕事": "work/job", "全部": "all/everything", "実家": "family home", "毎週末": "every weekend", "中国語": "Chinese language",
  "韓国語": "Korean language", "予定": "plan/schedule", "ゲーム": "game", "六時": "6 o'clock", "ジョギング": "jogging",
  "掃除": "cleaning", "庭": "garden/yard", "卒業": "graduation", "会社": "company", "時": "when/time",
  "間": "while/between", "前": "before", "だけ": "only", "ので": "because", "ため": "for/in order to",
  "明日": "tomorrow", "子供": "child/children", "映画": "movie", "カレー": "curry", "昼ご飯": "lunch",
  "太郎": "Taro (name)", "親": "parent", "背": "height/back", "文化": "culture", "これ": "this", "その": "that",
  "この": "this", "あの": "that", "鞄": "bag", "にんじん": "carrot", "ノート": "notebook", "のり": "glue/seaweed",
  "走る": "run", "降る": "fall(rain)", "見る": "see/watch", "飲む": "drink", "会う": "meet", "行く": "go", "好き": "like",
  "来る": "come", "する": "do", "出る": "go out/exit", "歩く": "walk", "聞く": "listen/hear", "暗い": "dark", "食べる": "eat",
  "教える": "teach", "描く": "draw", "開ける": "open", "遊ぶ": "play", "作る": "make", "借りる": "borrow", "帰る": "return home",
  "上手": "skilled/good at", "嫌い": "dislike", "書く": "write", "読む": "read", "寝る": "sleep", "勉強": "study",
  "話す": "speak", "始める": "begin", "起きる": "wake up/get up", "買う": "buy", "言う": "say", "思う": "think",
  "待つ": "wait", "心配": "worry", "難しい": "difficult", "美味しい": "delicious", "早い": "early/fast",
  "新しい": "new", "乗る": "ride/board", "引っ越す": "move (residence)", "あげる": "give", "高い": "tall/high",
  "つける": "attach/turn on", "できる": "can do", "運転する": "drive", "勉強する": "study",
  "です": "is/are", "だ": "is/are", "ている": "doing(continuous)", "てきた": "came after doing", "た": "did(past)",
  "ない": "not", "が": "but", "ので": "so/because", "時": "when", "ら": "if/when", "て": "and(connector)",
  "この": "this", "その": "that", "あの": "that over there", "どの": "which", "まだ": "still/not yet", "もう": "already",
  "いつも": "always", "とても": "very", "ちょっと": "a little", "たくさん": "many/a lot", "少し": "a little",
  "いる": "exist/be (animate)", "ある": "exist/have (inanimate)", "について": "about/concerning"
};

// Exception words (particles within words that should not be marked)
var DEMO_EXCEPTIONS = ["この", "その", "あの", "どの", "こんな", "そんな", "あんな", "どんな"];
var SEQ_EXCEPTIONS = ["です", "でした"];
var WORD_EXCEPTIONS = ["おにぎり", "のり", "はなし", "にんじん", "できる"];

// Sentence meanings (expanded to cover all sentences)
var MEANINGS = {
  // CORE sentences
  "私は日本語を勉強している。": "I am studying Japanese.",
  "明日学校でテストがある。": "There is a test at school tomorrow.",
  "駅まで歩いて行く。": "I walk to the station.",
  "友達と映画を見た。": "I watched a movie with my friend.",
  "図書館で本を借りた。": "I borrowed a book at the library.",
  "昼ご飯にカレーを食べた。": "I ate curry for lunch.",
  "猫が庭にいる。": "A cat is in the yard.",
  "東京へ引っ越した。": "I moved to Tokyo.",
  "七時に起きて、会社へ行く。": "I wake up at 7 and go to the office.",
  "この本は太郎にあげた。": "I gave this book to Taro.",
  "親より背が高い。": "I'm taller than my parents.",
  "牛乳しか飲まない。": "I only drink milk.",
  "駅から家まで走った。": "I ran from the station to home.",
  "先生とも話した。": "I also talked with the teacher.",
  "日本の文化について学ぶ。": "I learn about Japanese culture.",
  "明日も仕事がある。": "I also have work tomorrow.",
  "これは私のです。": "This is mine.",
  "公園で子供と遊ぶ。": "I play with children at the park.",

  // TRAPS
  "にんじんを食べる。": "I eat carrots.",
  "ノートにのりをつけた。": "I put glue on the notebook.",
  "できるだけ早く帰る。": "I return home as early as possible.",
  "この本を読んだ。": "I read this book.",
  "その映画は面白い。": "That movie is interesting.",

  // LEVEL1_EXT
  "犬が走る。": "A dog runs.",
  "雨が降る。": "Rain falls.",
  "花を見る。": "I see flowers.",
  "水を飲む。": "I drink water.",
  "友達に会う。": "I meet my friend.",
  "学校へ行く。": "I go to school.",
  "本が好きだ。": "I like books.",
  "車で来た。": "I came by car.",
  "母と買い物する。": "I shop with my mother.",
  "兄も来る。": "My older brother also comes.",
  "妹の鞄だ。": "It's my younger sister's bag.",
  "家から出る。": "I leave from home.",
  "駅まで歩く。": "I walk to the station.",
  "音楽を聞く。": "I listen to music.",
  "部屋が暗い。": "The room is dark.",
  "朝ご飯を食べる。": "I eat breakfast.",
  "先生が教える。": "The teacher teaches.",
  "絵を描く。": "I draw a picture.",
  "窓を開ける。": "I open the window.",
  "友達と遊ぶ。": "I play with friends.",

  // LEVEL2_EXT
  "母が料理を作っている。": "My mother is cooking.",
  "兄は毎日走っている。": "My older brother runs every day.",
  "妹も宿題をする。": "My younger sister also does homework.",
  "犬が公園で遊んでいる。": "A dog is playing in the park.",
  "私は本を図書館で借りた。": "I borrowed a book at the library.",
  "友達と映画館へ行った。": "I went to the movie theater with my friend.",
  "父が会社から帰ってきた。": "My father came home from work.",
  "彼女は日本語が上手だ。": "She is good at Japanese.",
  "昨日も雨が降った。": "It also rained yesterday.",
  "猫が魚を食べている。": "A cat is eating fish.",
  "弟は学校が嫌いだ。": "My younger brother dislikes school.",
  "姉が手紙を書いた。": "My older sister wrote a letter.",
  "彼は東京から来た。": "He came from Tokyo.",
  "私も歌が好きだ。": "I also like songs.",
  "先生が本を読んでいる。": "The teacher is reading a book.",
  "母が買い物に行った。": "My mother went shopping.",
  "兄が車を運転する。": "My older brother drives a car.",
  "友達の家へ行く。": "I go to my friend's house.",
  "毎日公園を散歩する。": "I walk in the park every day.",
  "駅から走って来た。": "I came running from the station.",

  // LEVEL3_EXT
  "彼は毎朝七時に起きて、会社へ行く。": "He wakes up at 7 every morning and goes to the office.",
  "私の母は料理が上手で、毎日美味しいものを作る。": "My mother is good at cooking and makes delicious food every day.",
  "友達が図書館で勉強している時、私は家で寝ていた。": "When my friend was studying at the library, I was sleeping at home.",
  "兄は東京の大学で経済を勉強している。": "My older brother is studying economics at a university in Tokyo.",
  "昨日駅前で友達に会って、一緒に映画を見た。": "I met my friend in front of the station yesterday and watched a movie together.",
  "彼女は日本語と英語が話せる。": "She can speak Japanese and English.",
  "父が会社から帰ってきたら、夕飯を食べる。": "When my father comes home from work, we eat dinner.",
  "妹は毎日ピアノを練習しているが、まだ上手ではない。": "My younger sister practices piano every day, but she's not good at it yet.",
  "公園で犬と遊んでいる子供たちを見た。": "I saw children playing with a dog in the park.",
  "明日は友達の家でパーティーがある。": "There is a party at my friend's house tomorrow.",
  "私は朝ご飯にパンと牛乳を食べた。": "I ate bread and milk for breakfast.",
  "彼は本を読むのが好きで、毎週図書館に行く。": "He likes reading books and goes to the library every week.",
  "母が買い物から帰ってきて、料理を始めた。": "My mother came back from shopping and started cooking.",
  "兄が新しい車を買ったので、私も乗せてもらった。": "My older brother bought a new car, so I got a ride too.",
  "駅まで歩いて行くより、バスで行く方が早い。": "Going by bus is faster than walking to the station.",

  // LEVEL4_EXT
  "私の父は毎朝六時に起きて、会社に行く前にジョギングをしている。": "My father wakes up at 6 every morning and goes jogging before going to work.",
  "友達が東京から大阪まで新幹線で行った時、私も一緒に行きたかったが、仕事があって行けなかった。": "When my friend went from Tokyo to Osaka by bullet train, I wanted to go too, but I couldn't because I had work.",
  "彼女は日本語の勉強を始めてから三年になるが、まだ漢字を読むのが難しいと言っている。": "It's been three years since she started studying Japanese, but she says reading kanji is still difficult.",
  "昨日図書館で本を借りようと思ったが、読みたい本が全部貸し出されていたので、諦めて帰った。": "I thought about borrowing a book at the library yesterday, but all the books I wanted to read were checked out, so I gave up and went home.",
  "母が料理を作っている間に、私は部屋を掃除して、父は庭で花に水をやっていた。": "While my mother was cooking, I was cleaning my room, and my father was watering the flowers in the garden.",
  "兄は大学を卒業してから東京の会社で働いているが、毎週末は実家に帰ってくる。": "My older brother has been working at a company in Tokyo since graduating from university, but he comes back to our family home every weekend.",
  "彼は日本語が上手に話せるだけではなく、中国語も韓国語も勉強している。": "He not only speaks Japanese well, but is also studying Chinese and Korean.",
  "明日友達と映画を見に行く予定だったが、雨が降りそうなので、家でゲームをすることにした。": "I was planning to go see a movie with my friend tomorrow, but it looks like it will rain, so we decided to play games at home instead.",
  "私は朝ご飯を食べてから学校に行くが、弟は食べないで行くので、母がいつも心配している。": "I eat breakfast before going to school, but my younger brother goes without eating, so my mother always worries.",
  "彼女が駅で待っていると言ったので、私は急いで行ったが、彼女はもう帰ってしまっていた。": "She said she was waiting at the station, so I hurried there, but she had already gone home."
};
