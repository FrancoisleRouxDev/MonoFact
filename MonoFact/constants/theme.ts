import { Colors } from "./Colors";

export const Theme = {

  screen:{

    backgroundColor:Colors.background,

  },

  card:{

    backgroundColor:Colors.surface,

    borderRadius:24,

    padding:20,

  },

  primaryButton:{

    backgroundColor:Colors.primary,

    borderRadius:18,

    height:56,

    justifyContent:"center",

    alignItems:"center",

  },

  shadow:{

    shadowColor:"#000",

    shadowOpacity:0.08,

    shadowRadius:18,

    shadowOffset:{
      width:0,
      height:8,
    },

    elevation:6,

  },

};