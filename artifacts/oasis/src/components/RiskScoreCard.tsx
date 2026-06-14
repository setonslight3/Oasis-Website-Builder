import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { getRiskColor } from "@/lib/search";
import { Badge } from "@/components/ui/badge";

interface RiskScoreCardProps {
  target: string;
  risk: string;
  confidence: number;
  reports: number;
  date: string;
}

export function RiskScoreCard({ target, risk, confidence, reports, date }: RiskScoreCardProps) {
  const colors = getRiskColor(risk);
  
  const getRecommendation = () => {
    if (risk === 'High') return "Do not proceed with any transactions. High probability of fraud.";
    if (risk === 'Medium') return "Proceed with extreme caution. Verify identity through secondary means.";
    return "No significant risk patterns detected, but always remain vigilant.";
  };

  const getIcon = () => {
    if (risk === 'High') return <AlertTriangle className="w-12 h-12 text-red-500" />;
    if (risk === 'Medium') return <Info className="w-12 h-12 text-amber-500" />;
    return <ShieldCheck className="w-12 h-12 text-emerald-500" />;
  };

  return (
    <Card className={`border-2 ${colors.border} shadow-sm overflow-hidden`} data-testid="card-risk-score">
      <div className={`px-6 py-4 border-b ${colors.border} ${colors.bg} flex justify-between items-center`}>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">TARGET EVALUATION</p>
          <h3 className="text-xl font-bold text-gray-900">{target}</h3>
        </div>
        <Badge className={`${colors.badge} text-sm px-3 py-1 font-bold shadow-none`}>
          {risk.toUpperCase()} RISK
        </Badge>
      </div>
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:w-1/3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 text-center">
            {getIcon()}
            <div className="mt-4">
              <span className={`text-4xl font-black ${colors.text}`}>{confidence}%</span>
              <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">Confidence Score</p>
            </div>
          </div>
          
          <div className="p-6 md:w-2/3 flex flex-col justify-center space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Report Count</p>
                <p className="text-lg font-bold text-gray-900">{reports} {reports === 1 ? 'Report' : 'Reports'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Reported</p>
                <p className="text-lg font-semibold text-gray-900">{new Date(date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
              <p className={`text-sm font-medium ${colors.text}`}>
                <strong>Recommendation:</strong> {getRecommendation()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
