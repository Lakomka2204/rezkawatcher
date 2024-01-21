import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { HistoryMovie } from '../logic/movie';
import { getAllMovies } from '../storage/history';
import MovieHistory from './MovieHistory';

function History() {
    const colors = useTheme().colors;
    const [history,setHistory] = useState<HistoryMovie[]>([]);
    useEffect(() => {
        setHistory(getAllMovies())
    }, []);
    return (
        <View>
            <Text
                style={{ color: colors.text }}
                className={'text-4xl font-semibold self-start mt-2 mb-2'}>
                History
            </Text>
            <View>
                {history.length > 0 ?
                    <View>
                        <FlatList
                            data={history}
                            initialNumToRender={8}
                            renderItem={({ item }) => <MovieHistory movie={item}/>} />
                    </View>
                    :
                    <Text style={{ color: colors.text }}>
                        There's no movies yet, so start watching!
                    </Text>
                }
            </View>
        </View>
    );
}

export default History;
