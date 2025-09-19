import React , {useState , useEffect} from 'react'
import { TouchableOpacity,View, Text , FlatList,StyleSheet ,ActivityIndicator , TextInput} from 'react-native'

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { translation } from "../../i18n/supportedLanguages";
import { useQuery } from "@apollo/client";
import { SUPPLIERS_QUERY } from "../../gql/Query";
import { LoginScreen} from "../LoginScreen"
// import AddSupplier from '../../screens/ediDcreens/AddSupplierScreen';

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n(translation);
  
  // Set the locale once at the beginning of your app.
  i18n.locale = Localization.locale;
  
  // When a value is missing from a language it'll fallback to another language with the key present.
  i18n.enableFallback = true;
  // To see the fallback mechanism uncomment line below to force app to use Japanese language.
  // i18n.locale = 'ja';

  export const SuppliersScreen = ({navigation}) => {
    const { loading, error, data } = useQuery(SUPPLIERS_QUERY);
    const [search, setSearch] = useState('');
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  
    useEffect(() => {
      if (data) {
        setFilteredSuppliers(data.suppliers);
      }
    }, [data]);


    const SupplierItem = ({ name, number , products }) => (
       <TouchableOpacity
        onPress={()=>navigation.navigate('SupplierDetails', {
            number: number,
            name: name,
          })}
      >
      <View style={styles.item}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.number}>{number}</Text>
      </View>
      </TouchableOpacity>
    );
  
    const handleSearch = (text) => {
      setSearch(text);
      if (text) {
        const filteredData = data.suppliers.filter(item => 
          item.name.toLowerCase().includes(text.toLowerCase()) || 
          item.number.toString().includes(text)
        );
        setFilteredSuppliers(filteredData);
      } else {
        setFilteredSuppliers(data.suppliers);
      }
    };
  
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error.message}</Text>;
    
      return (
        
        <View style={styles.container}>
       <TextInput
          style={styles.searchBar}
          placeholder="Search by name or number"
          value={search}
          onChangeText={handleSearch}
        />
  
      <FlatList
        data={filteredSuppliers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SupplierItem name={item.name} number={item.number} />
        )}
      />
       </View>
    );
   
  }
  
  const styles = StyleSheet.create({
  
    searchBar: {
      height: 60,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 15,
      paddingLeft: 10,
      margin: 10,
      fontSize:20
    },
    
    
    container: {
      flex: 1,
      padding: 8,
      flexDirection: "column", // main axis
      justifyContent: "center", // main axis
      //alignItems: "center", // cross axis
      //backgroundColor: colors.background_dark
    },
  
    flatList: {
      //width: '100%',
      marginTop: 14,
      alignSelf: "stretch",
    },
    item: {
      //width: '100%',
      backgroundColor:'#d3d3d3',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      borderRadius:15,
      alignItems:"center",
      marginBottom:10
    },
    name: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    number: {
      fontSize: 20,
      color: '#555',
    },
  });