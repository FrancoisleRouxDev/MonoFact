import { SafeAreaView, View, Text, StyleSheet, Pressable } from "react-native";
import { Check } from "lucide-react-native";
import { useRouter } from "expo-router";

import AnswerCard from "@/components/cards/AnswerCard";
import FactExplanation from "@/components/gameplay/FactExplanation";


export default function ResultScreen(){

    const router = useRouter();

return(

<SafeAreaView style={styles.container}>

<View style={styles.icon}>

<Check size={60} color="#444"/>

</View>

<Text style={styles.correct}>

Correct!

</Text>

<Text style={styles.xp}>

+10 XP earned

</Text>

<AnswerCard
isCorrect={true}
answer="MYTH"
statement="Bees can recognize human faces and remember them."
/>

<FactExplanation
    title="Did you know?"
    description="Bees use configural processing to recognize faces."
/>

<Pressable style={styles.button}
            onPress={() => router.push("/game/complete")}
>

<Text style={styles.buttonText}>

Continue →

</Text>

</Pressable>

</SafeAreaView>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
padding:24,
backgroundColor:"#EDF8F2",
},

icon:{
alignItems:"center",
marginTop:50,
},

correct:{
fontSize:44,
fontWeight:"700",
textAlign:"center",
marginTop:30,
},

xp:{
textAlign:"center",
marginBottom:35,
color:"#777",
},

button:{
marginTop:"auto",
height:62,
backgroundColor:"#7F8798",
justifyContent:"center",
alignItems:"center",
borderRadius:18,
},

buttonText:{
color:"#FFF",
fontSize:22,
fontWeight:"700",
}

});