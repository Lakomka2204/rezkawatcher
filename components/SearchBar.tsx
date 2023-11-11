import React, {useState, useEffect, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Platform} from 'react-native';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import {quickSearch} from '../logic/movie';
import {NavigationProps} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

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
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();

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
          nav.push('mov', {link: selectedId});
        }
        break;
      case 'submit':
        if (query?.trim()) {
          nav.push('sub', {query, page: 1});
        }
        break;
      default:
        break;
    }
    setEvent('none');
  }, [event, query, suggestionsList, nav]);

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
      onChangeText={t => getSuggestions(t)}
      onSelectItem={i => handleItemSelect(i)}
      closeOnSubmit={true}
      onSubmit={() => handleQuerySubmit()}
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
      containerStyle={{
        width: '80%',
      }}
      debounce={500}
      onClear={() => clearSuggestions()}
      showChevron={false}
      clearOnFocus={false}
      closeOnBlur={false}
    />
  );
}

export default SearchBar;
