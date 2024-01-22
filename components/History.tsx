import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { HistoryMovie } from '../logic/movie';
import { getAllMovies } from '../storage/history';
import MovieHistory from './MovieHistory';

function History() {
    const colors = useTheme().colors;
    const [history, setHistory] = useState<HistoryMovie[]>([]);
    useEffect(() => {
        setHistory(getAllMovies())
    }, []);
    return (
        <View className='h-full flex flex-col p-3'>
            <Text
                style={{ color: colors.text }}
                className='text-4xl font-semibold self-start mb-2
                flex-grow-0'>
                History
            </Text>
            {history.length > 0 ?
                <FlatList
                    data={history}
                    initialNumToRender={4}
                    className='flex-grow'
                    renderItem={({ item }) => <MovieHistory movie={item} />} />
                :
                <Text style={{ color: colors.text }}>
                    There's no movies yet, so start watching!
                </Text>
            }
        </View>
    );
}

export default History;
