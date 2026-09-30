import { AppProvider } from './src/shared/AppContext';
import NativeApp from './src/components/NativeApp/NativeApp';

export default function App() {
    return (
        <AppProvider>
            <NativeApp />
        </AppProvider>
    );
}
