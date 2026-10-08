import {render, screen} from '@testing-library/react-native';
import * as Device from 'expo-device';
import {Plataform} from 'react-native';
import HomeScreen from '../screens/Home/HomeScreen';


describe('HomeScreen', ()=>{
    afterEach(() =>{
        jest.restoreAllMocks(); //desfaz o replaceProperty de cada teste
    });

    test('mostra o título de boas vindas', async ()=>{
        await render(<HomeScreen/>);
        expect(screen.getByText(/BoasVindas/)).toBeOnScreen();
    })
    /*
    nos métodos que utilizamos aqui, temos 3 coisas para testar nos testes de frontend:
    Arrange, Assert e Act
    */
})