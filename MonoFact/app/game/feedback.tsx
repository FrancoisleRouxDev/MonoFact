import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

import {
Trophy,
Target,
BarChart3,
Zap,
Flame,
} from "lucide-react-native";

import ResultStatCard from "@/components/cards/ResultStatCard";
import RoundStats from "@/components/gameplay/RoundStats";


export default function FeedbackScreen(){

const router = useRouter();

return(

<SafeAreaView style={styles.container}>

<ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
>
<View style={styles.header}>

<Trophy
size={90}
color="#1F2337"
/>

<Text style={styles.title}>

Round Complete!

</Text>

<Text style={styles.subtitle}>

Science • 5 Questions

</Text>

</View>

<View style={styles.grid}>

<ResultStatCard
icon={Target}
value="4 / 5"
label="Final Score"
/>

<ResultStatCard
icon={BarChart3}
value="80%"
label="Accuracy"
/>

<ResultStatCard
icon={Zap}
value="+240"
label="XP"
/>

<ResultStatCard
icon={Flame}
value="3"
label="Best Streak"
/>

</View>

<RoundStats
currentXP={4820}
requiredXP={5000}
level={7}
/>

<Pressable style={styles.primary}
           onPress={() => router.push("/(tabs)/play")}

>

<Text style={styles.primaryText}>

Play Again

</Text>

</Pressable>

<Pressable style={styles.secondary}
        onPress={() => router.push("/(tabs)")}
>

<Text style={styles.secondaryText}>

Return Home

</Text>

</Pressable>

</ScrollView>


</SafeAreaView>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F5F6FA",
padding:24,
},

header:{
alignItems:"center",
paddingVertical:40,
},

title:{
fontSize:42,
fontWeight:"700",
marginTop:20,
},

subtitle:{
marginTop:8,
color:"#777",
},

grid:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between",
gap:15,
marginVertical:30,
},

primary:{
height:60,
borderRadius:18,
backgroundColor:"#868D9A",
justifyContent:"center",
alignItems:"center",
marginTop:30,
},

secondary:{
height:60,
justifyContent:"center",
alignItems:"center",
},

primaryText:{
color:"#FFF",
fontWeight:"700",
fontSize:20,
},

secondaryText:{
fontWeight:"700",
fontSize:20,
color:"#243A5A",
}

});