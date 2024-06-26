import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity, Button, FlatList, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from "../firebaseConfig";

const Quiz = ({navigation}) => {
  const [routes, setRoutes] = useState([]);
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sportCounter, setSportCounter] = useState(0);
  const [natureCounter, setNatureCounter] = useState(0);
  const [cultureCounter, setCultureCounter] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizResult, setQuizResult] = useState("");
  const [quizResultDescription, setQuizResultDescription] = useState("");
  const [suggestedRoute, setSuggestedRoute] = useState("");
  const [questionCounter, setQuestionCounter] = useState(0);

  const quizQuestions = [
    {
      question: t("questionOne"),
      options: [t("q1o1"), t("q1o2"), t("q1o3")]
    },
    {
      question: t("questionTwo"),
      options: [t("q2o1"), t("q2o2"), t("q2o3")]
    },
    {
      question: t("questionThree"),
      options: [t("q3o1"), t("q3o2"), t("q3o3")]
    },
    {
      question: t("questionFour"),
      options: [t("q4o1"), t("q4o2"), t("q4o3")]
    },
    {
      question: t("questionFive"),
      options: [t("q5o1"), t("q5o2"), t("q5o3")]
    },
    {
      question: t("questionSix"),
      options: [t("q6o1"), t("q6o2"), t("q6o3")]
    },
    {
      question: t("questionSeven"),
      options: [t("q7o1"), t("q7o2"), t("q7o3")]
    },
  ];

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === quizQuestions[currentQuestion].options[0]) {
      setNatureCounter(prev => prev + 1);
      const nextQuestionCounter = questionCounter + 1;
        setQuestionCounter(nextQuestionCounter);
        console.log(questionCounter);
    } else if (selectedAnswer === quizQuestions[currentQuestion].options[1]) {
      setSportCounter(prev => prev + 1);
      const nextQuestionCounter = questionCounter + 1;
        setQuestionCounter(nextQuestionCounter);
        console.log(questionCounter);
    } else {
      setCultureCounter(prev => prev + 1);
      const nextQuestionCounter = questionCounter + 1;
        setQuestionCounter(nextQuestionCounter);
        console.log(questionCounter);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      if ((natureCounter > sportCounter) && (natureCounter > cultureCounter)) {
        setQuizResult(t("questionResultNature"));
        setQuizResultDescription("Radi se umaknete izven mesta v naravo, kjer si lahko v miru spočijete.");
      } else if ((sportCounter > natureCounter) && (sportCounter > cultureCounter)) {
        setQuizResult(t("questionResultSport"));
        setQuizResultDescription("Ste polni energije, ki jo z veseljem pokurite z izvajanjem različnih športnih aktivnosti.");
      } else {
        setQuizResult(t("questionResultCulture"));
        setQuizResultDescription("Na potovanju se radi učite in raziskujete lokalno kulturo.");
      }
      setShowScore(true);
    }
  };

  useEffect(() => {
    const fetchRoutesAdmin = async () => {
      try {
        const routesRef = collection(firestore, 'routes');
        const q = query(routesRef, where('admin', '==', true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('No routes available.');
          return;
        }

        const fetchedRoutes = [];
        for (const doc of querySnapshot.docs) {
          const routeData = { id: doc.id, ...doc.data() };
          const monumentsSnapshot = await getDocs(collection(firestore, `routes/${doc.id}/monuments`));
          routeData.monuments = monumentsSnapshot.docs.map(monumentDoc => monumentDoc.data());
          fetchedRoutes.push(routeData);
        }

        setRoutes(fetchedRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
    fetchRoutesAdmin();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Na ExplorerAI kvizu sem dobil ' + quizResult + " pot. Obišči ExplorerAI še ti in reši kviz!",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {showScore ? (
        <FlatList
          ListHeaderComponent={
            <View style={styles.resultsStyle}>
              <Text style={styles.resultsStyle}>{t("routeChoice")} {quizResult}</Text>
              <Text style={styles.resultsDescStyle}>{quizResultDescription}</Text>
              <Text style={styles.resultsRec}>{t("recommendedRoutes")} {suggestedRoute}</Text>
            </View>
          }
          data={routes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.routeName}>{item.name}</Text>
              <Text style={styles.routeDescription}>{item.description}</Text>
              <Text style={styles.routeInfo}>Trajanje: {item.duration}</Text>
              <Text style={styles.routeInfo}>Znamenitosti: {item.monuments ? item.monuments.length : 0}</Text>
            </View>
          )}
          ListFooterComponent={
            <Button style={styles.buttonShare} onPress={onShare} title="Prijatelju pošlji rezultat kviza" />
          }
        />
      ) : (
        <View style={styles.container}>
          <Text style={styles.quizTitle}> {t("quizTitle")} </Text>
          <Text style={styles.quizSubTitle}> {t("quizSubTitle")} </Text>
        <FlatList
          ListHeaderComponent={
            <View style={styles.questionContainer}>
              <Text style={styles.questionStyle}>{t("question")} {questionCounter + 1}</Text>
              <Text style={styles.questionStyle}>{quizQuestions[currentQuestion]?.question}</Text>
              {quizQuestions[currentQuestion]?.options.map((item, index) => (
                <TouchableOpacity key={index} style={styles.questionOptionsContainer} onPress={() => handleAnswer(item)}>
                  <Text style={styles.questionOptions}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          }
          data={[]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={null}
        />
        {/* <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.navigate('home-page')}>
          <Text style={styles.goBackBtnText}>Nazaj</Text>
        </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FC',
    alignItems: "center",
    justifyContent: "center",
  },
  quizTitle: {
    marginTop: 50,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  quizSubTitle: {
    marginTop: 20,
    marginBottom: 50,
    fontSize: 17,
    textAlign: "center",
  },
  map: {
    width: '100%',
    height: '100%',
  },
  questionContainer: {
      padding: 10,
      margin: 10,
      borderRadius: 10,
      backgroundColor: "white",
      shadowRadius: 5,
      elevation: 2,
      alignSelf: "center",
  },
  questionOptions: {
      padding: 5,
      alignSelf: 'center',
      fontSize: 15,
  },
  questionOptionsContainer: {
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 10,
      marginTop: 15,
      backgroundColor: "#e1e8eb",
      textAlign: "center",
      padding: 5,
  },
  questionStyle: {
      fontSize: 20,
      alignSelf: 'center',
      fontWeight: 'bold',
    },
  resultsStyle: {
    fontSize: 18,
    alignSelf: 'center',
    padding: 10,
    margin: 10,
    fontWeight: "bold",
  },
  resultsDescStyle: {
    fontSize: 15,
    alignSelf: 'center',
    padding: 5,
    margin: 10,
  },
  resultsRec: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: "bold",
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  routeInfo: {
    fontSize: 12,
    color: '#888',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
    marginBottom: 10,
  },
  containerRoutes: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
  },
  buttonShare: {
    margin: 10,
    marginBottom: 10,
  },
  goBackBtn: {
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: "#007BFF",
    textAlign: "center",
    padding: 5,
    width: 200,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  goBackBtnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  }
});

export default Quiz;
