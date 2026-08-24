import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

/**
 * Props for ResultStatCard displayed on round summary and completed screens.
 */
type Props = {
    icon: LucideIcon;
    value: string;
    label: string;
};

/**
 * ResultStatCard renders an individual stat metric (accuracy %, score, XP earned)
 * in a stylized grid card.
 */
export default function ResultStatCard({
    icon: Icon,
    value,
    label,
}: Props) {

    return(

        <View style={styles.card}>

            <Icon
                size={30}
                color="#1F2337"
            />

            <Text style={styles.value}>
                {value}
            </Text>

            <Text style={styles.label}>
                {label}
            </Text>

        </View>

    );

}

const styles=StyleSheet.create({

card:{
    width:"47%",
    backgroundColor:"#F7F8FD",
    borderRadius:20,
    padding:22,
    alignItems:"center",
},

value:{
    fontSize:30,
    fontWeight:"700",
    marginTop:14,
},

label:{
    color:"#98A2B3",
    marginTop:8,
}

});