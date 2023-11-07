import React, {useState, useEffect, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Platform} from 'react-native';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import {quickSearch} from '../logic/movie';

interface Result {
  id: string;
  title: string;
}

type Event = 'none' | 'item' | 'submit';

function SearchBar() {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState<Result[]>([]);
  const [query, setQuery] = useState('');
  const [event, setEvent] = useState<Event>('none');
  const navigation = useNavigation();

  const getSuggestions = useCallback((inputQuery: string) => {
    setQuery(inputQuery);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestionsList([]);
  }, []);

  useEffect(() => {
    if (!query) return; // No need to perform a search if query is empty.

    setLoading(true);
    quickSearch(query.toLowerCase())
      .then(response => {
        const suggestions = response.map<Result>(item => ({
          id: item.url ?? 'MOVIE_ID',
          title: item.name ?? 'MOVIE_NAME',
        }));
        setSuggestionsList(suggestions);
        setLoading(false);
      })
      .catch(error => {
        console.error('qsThen error', error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  useEffect(() => {
    switch (event) {
      case 'item':
        const selectedId = suggestionsList.find(
          item => item.title === query,
        )?.id;
        if (selectedId) {
          React.useEffect(() => {
            // @ts-ignore
            navigation.navigate('mov', {link: selectedId});
          }, []);
        }
        break;
      case 'submit':
        if (query?.trim()) {
          // @ts-ignore
          navigation.navigate('sub', {query});
        }
        break;
      default:
        break;
    }
    setEvent('none');
  }, [event, query, suggestionsList, navigation]);

  const handleItemSelect = (item: TAutocompleteDropdownItem) => {
    if (item) {
      setQuery(item.title!);
      setEvent('item');
    }
  };

  const handleQuerySubmit = () => {
    if (query?.trim()) {
      setEvent('submit');
    }
  };

  return (
    <AutocompleteDropdown
      direction={Platform.select({ios: 'down'})}
      dataSet={suggestionsList}
      onChangeText={getSuggestions}
      onSelectItem={handleItemSelect}
      closeOnSubmit={true}
      onSubmit={handleQuerySubmit}
      useFilter={false}
      loading={loading}
      textInputProps={{
        placeholder: 'Search for a movie',
        autoCorrect: false,
        autoCapitalize: 'none',
        placeholderTextColor: '#888',
      }}
      inputContainerStyle={{
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'white',
      }}
      debounce={500}
      onClear={clearSuggestions}
      showChevron={true}
      clearOnFocus={false}
      closeOnBlur={false}
    />
  );
}

export default SearchBar;
