import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import cn from 'classnames';
import { Rating } from '../logic/movie';
function RatingBubble(rating: Rating) {
  return (
    <TouchableOpacity className={ratingTouchable}>
              <Text className={cn(ratingText, "text-yellow-500")}>
                {rating.name} <Text className={'text-xl font-bold text-yellow-500'}></Text>
              </Text>
            </TouchableOpacity>
  )
}
const ratingTouchable = "bg-gray-200 border-gray-500 border-2 rounded-lg";
const ratingText = "text-xl font-semibold p-2 text-center";
export default RatingBubble