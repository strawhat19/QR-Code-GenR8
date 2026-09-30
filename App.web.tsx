import './src/styles/global.scss';
import { AppProvider } from './src/shared/AppContext';
import { Website } from './src/components/Website/Website.web';

export default function App() {
    return (
        <AppProvider>
            <Website />
        </AppProvider>
    );
}
