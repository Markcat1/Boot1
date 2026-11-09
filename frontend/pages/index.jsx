import CorporateDashboard from '../components/CorporateDashboard';
import OfflineRiskMap from '../components/OfflineRiskMap';

export default function Home() {
  return (
    <div>
      <CorporateDashboard />
      <hr />
      <OfflineRiskMap />
    </div>
  );
}