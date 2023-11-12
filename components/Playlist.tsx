import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import Button from './Button';
import {Text} from 'react-native';
import cn from 'classnames';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Episode,
  Season,
  Translation,
  getTranslationSeries,
} from '../logic/movie';
import {AsyncState} from '../App';
type ExpansionType = 'translation' | 'season' | 'episode' | 'movie';
type MovieType = 'series' | 'movie';
type MovieInfo = {
  id: string;
  favs: string;
};
type returnFn = (watchInfo: {item: Item; type: MovieType}) => void;
interface Selected {
  translation?: string;
  season?: string;
  episode?: string;
}
interface Item {
  translation: Translation;
  name: string;
  episode?: Episode;
  season?: Season;
  type: ExpansionType;
}

function RenderChildren(args: {
  children: Item[];
  returnFn: returnFn;
  type: MovieType;
  info: MovieInfo;
  level: number;
  state: AsyncState;
  selected: Selected;
}) {
  switch (args.state) {
    case 'loading':
      return <ActivityIndicator color={'white'} size={'large'} />;
    case 'success':
      return (
        <Playlist
          selected={args.selected}
          level={args.level + 1}
          returnFn={args.returnFn}
          items={args.children}
          type={args.type}
          info={args.info}
        />
      );
    case 'fail':
      return (
        <View className="flex flex-row items-center">
          <Icon name="times" color={'red'} />
          <Text>Error</Text>
        </View>
      );
    default:
      return <></>;
  }
}

function PlaylistItem(args: {
  item: Item;
  returnFn: returnFn;
  type: MovieType;
  info: MovieInfo;
  level: number;
  selected: Selected;
}) {
  const [isOpen, setOpen] = useState(false);
  const [children, setChild] = useState<Item[]>([]);
  const [state, setState] = useState<AsyncState>('idle');
  const hasChild =
    ['season', 'translation'].includes(args.item.type) && args.type == 'series';
  function checkSelected(): boolean {
    const current = {
      episode: args.item.episode?.id,
      season: args.item.season?.id,
      translation: args.item.translation.id,
    };
    const selected = args.selected;
    let verdict: boolean = true;
    switch (args.item.type) {
      case 'episode':
        verdict = verdict && current.episode === selected.episode;
      case 'season':
        verdict = verdict && current.season === selected.season;
      case 'translation':
      case 'movie':
        verdict = verdict && current.translation === selected.translation;
        break;
    }
    return verdict;
  }
  const isSelected = checkSelected();
  useEffect(() => {
    async function fetch() {
      if (!['idle', 'fail'].includes(state)) return;
      if (state == 'loading') return;
      if (!isOpen) return;
      try {
        switch (args.item.type) {
          case 'translation':
            setState('loading');
            if (args.type == 'movie') {
              args.returnFn(args);
              break;
            }
            const seasons = await getTranslationSeries(
              args.info.id,
              args.info.favs,
              args.item.translation,
            );
            const childSeasons = seasons.map<Item>(x => ({
              name: x.name,
              translation: x.translation,
              type: 'season',
              season: x,
            }));
            setChild(childSeasons);
            setState('success');
            break;
          case 'season':
            setState('loading');
            const childEpisodes = args.item.season!.episodes.map<Item>(x => ({
              name: x.name,
              translation: args.item.translation,
              type: 'episode',
              episode: x,
              season: args.item.season,
            }));
            setChild(childEpisodes);
            setState('success');
            break;
          case 'episode':
          case 'movie':
            setState('loading');
            args.returnFn(args);
            setState('notfound');
            break;
        }
      } catch (err) {
        setState('fail');
      }
    }
    fetch();
  }, [isOpen]);
  return (
    <View style={{marginLeft: 12 * args.level}}>
      <Button onClick={() => setOpen(!isOpen)}>
        <View
          className={cn(
            'm-1 p-2 self-stretch flex flex-row items-center',
            'border-2 rounded-md border-white',
          )}>
          {hasChild && (
            <Icon
              style={{paddingHorizontal: 10}}
              name={isOpen ? 'caret-down' : 'caret-right'}
              size={20}
              color={'white'}
            />
          )}
          <Text className={cn('text-white text-xl', isSelected && 'font-bold')}>
            {args.item.name}
          </Text>
        </View>
      </Button>
      {isOpen && (
        <RenderChildren
          selected={args.selected}
          children={children}
          info={args.info}
          level={args.level}
          returnFn={args.returnFn}
          state={state}
          type={args.type}
        />
      )}
    </View>
  );
}
function Playlist(args: {
  type: MovieType;
  items: Item[];
  returnFn: returnFn;
  info: MovieInfo;
  level: number;
  selected: Selected;
}) {
  return args.items.map(x => (
    <PlaylistItem
      selected={args.selected}
      level={args.level}
      key={
        args.info.id +
        x.name +
        args.items.length +
        args.info.favs +
        x.type +
        args.level
      }
      item={x}
      returnFn={args.returnFn}
      type={args.type}
      info={args.info}
    />
  ));
}

export default Playlist;
