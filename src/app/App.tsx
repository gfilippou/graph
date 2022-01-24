import 'src/app/App.css';
import { Header } from 'src/components/header/header';
import { Main } from 'src/components/main/main';
import { Footer } from 'src/components/footer/footer';
import EventSourceAdapter from 'src/eventSource/eventSourceAdapter';
import State from 'src/app/Provider';

const App = () => {
  return (
    <State>
      <EventSourceAdapter>
        <div className='App'>
          <Header />
          <Main />
          <Footer />
        </div>
      </EventSourceAdapter>
    </State>
  );
};

export default App;
