import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";


import AnswerCard from "@/components/cards/AnswerCard";
import FactExplanation from "@/components/gameplay/FactExplanation";


export default function ResultsScreen(){

    const router = useRouter();

return(

<SafeAreaView style={styles.container}>

<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={styles.scrollContent}
>

<View style={styles.content}>

<View style={styles.icon}>

<Check size={54} color={Colors.surface} strokeWidth={3.5} />

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
statement="Bees can recognize human faces and remember them for several days."
/>

<FactExplanation
    title="Did you know?"
    description="Bees use a process called configural processing — the same way humans recognize faces — and can recall faces for up to 2 days."
/>

</View>

<Pressable style={styles.button}
            onPress={() => router.push("/game/feedback")}
>

<Text style={styles.buttonText}>

Continue →

</Text>

</Pressable>

</ScrollView>

</SafeAreaView>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
paddingHorizontal:Spacing.lg,
paddingVertical:Spacing.md,
backgroundColor:"#EDF9F4",
},

content:{
flex:1,
alignItems:"center",
paddingTop:Spacing.xl,
},

scrollContent: {
paddingBottom: Spacing.xl,
},

icon:{
alignItems:"center",
justifyContent:"center",
width:92,
height:92,
borderRadius:28,
backgroundColor:Colors.cardDaily,
shadowColor:Colors.success,
shadowOpacity:0.16,
shadowRadius:20,
shadowOffset:{
width:0,
height:12,
},
elevation:6,
},

correct:{
...Typography.h1,
color:Colors.cardDaily,
textAlign:"center",
marginTop:Spacing.md,
},

xp:{
textAlign:"center",
...Typography.caption,
color:Colors.textSecondary,
marginTop:Spacing.xs,
marginBottom:Spacing.md,
},

button:{
height:60,
backgroundColor:Colors.primary,
justifyContent:"center",
alignItems:"center",
borderRadius:20,
shadowColor:Colors.shadow,
shadowOpacity:0.12,
shadowRadius:16,
shadowOffset:{
width:0,
height:8,
},
elevation:5,
marginTop:Spacing.lg,
},

buttonText:{
...Typography.title,
color:Colors.surface,
}

});