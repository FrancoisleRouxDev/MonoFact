import { ReactNode } from "react";
import { Dimensions } from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from "react-native-reanimated";

import {
    Gesture,
    GestureDetector,
} from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
    children: ReactNode;

    onSwipeLeft: () => void;

    onSwipeRight: () => void;
};

export default function SwipeableQuestionCard({

    children,

    onSwipeLeft,

    onSwipeRight,

}: Props) {

    const translateX = useSharedValue(0);

    const rotate = useSharedValue(0);

    const pan = Gesture.Pan()

        .onUpdate((event) => {

            translateX.value = event.translationX;

            rotate.value = event.translationX / 20;

        })

        .onEnd(() => {

            if (translateX.value < -120) {

                translateX.value = withSpring(-SCREEN_WIDTH);

                runOnJS(onSwipeLeft)();

            }

            else if (translateX.value > 120) {

                translateX.value = withSpring(SCREEN_WIDTH);

                runOnJS(onSwipeRight)();

            }

            else {

                translateX.value = withSpring(0);

                rotate.value = withSpring(0);

            }

        });

    const style = useAnimatedStyle(() => {

        return {

            transform: [

                {

                    translateX: translateX.value,

                },

                {

                    rotate: `${rotate.value}deg`,

                },

            ],

        };

    });

    return (

        <GestureDetector gesture={pan}>

            <Animated.View style={style}>

                {children}

            </Animated.View>

        </GestureDetector>

    );

}