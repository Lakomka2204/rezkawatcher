import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import axios from 'axios';
import {Keyboard, Platform, TextInput} from 'react-native';
import {
  AutocompleteDropdown,
  AutocompleteDropdownProps,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import {quickSearch} from '../logic/movie';
import {NavigationProps} from '../utils/types';
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
  const {colors, dark} = useTheme();
  const route = useRoute<RouteProp<NavigationProps>>();
  const searchBar = useRef<TextInput>(null);
  const getSuggestions = useCallback((inputQuery: string) => {
    setQuery(inputQuery);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestionsList([]);
  }, []);
  useEffect(() => {
    // @ts-ignore
    if (route.params['search']) {
      searchBar.current?.focus();
    }
  }, [route]);

  useEffect(() => {
    if (!query) return; // No need to perform a search if query is empty.

    setLoading(true);
    quickSearch(query)
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
      ref={searchBar}
      direction={Platform.select({ios: 'down'})}
      dataSet={suggestionsList}
      onChangeText={t => getSuggestions(t)}
      onSelectItem={i => handleItemSelect(i)}
      closeOnSubmit={true}
      onSubmit={() => handleQuerySubmit()}
      useFilter={false}
      loading={loading}
      textInputProps={{
        keyboardType: 'web-search',
        placeholder: 'Search for a movie',
        autoCorrect: false,
        autoCapitalize: 'none',
        placeholderTextColor: dark ? '#ccc' : '#666',
        cursorColor: colors.text,
        selectionColor: colors.primary,
      }}
      inputContainerStyle={{
        borderColor: colors.text,
        borderWidth: 1,
        backgroundColor: colors.background,
      }}
      suggestionsListTextStyle={{
        color: colors.text,
      }}
      suggestionsListContainerStyle={{
        backgroundColor: colors.background,
        shadowColor: colors.border,
        borderColor: colors.text,
        borderWidth: 1,
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
