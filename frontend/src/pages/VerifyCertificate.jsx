import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ShieldCheck, ShieldAlert, Award, Calendar, Bookmark, ArrowLeft } from 'lucide-react';

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!certificateId) return;

    api.verifyCertificate(certificateId)
      .then((data) => {
        if (data.verified) {
          setCertData(data);
        } else {
          setError(data.message || 'This certificate has not been verified or is pending completion.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to verify certificate.');
        setLoading(false);
      });
  }, [certificateId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-mesh text-theme-title">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-theme-title border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4">
      <div className="w-full max-w-lg bg-theme-card border border-theme-border text-center relative overflow-hidden space-y-8 rounded-2xl shadow-md p-8">
        <div className="absolute top-0 left-0 w-32 h-32 bg-theme-title/5 rounded-full blur-3xl"></div>

        {error ? (
          <div className="space-y-6">
            <div className="mx-auto h-16 w-16 border border-rose-950 bg-rose-950/20 flex items-center justify-center text-rose-500 rounded-full">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-2xl font-light text-rose-500">Verification Failed</h1>
              <p className="text-theme-desc text-base leading-relaxed max-w-sm mx-auto">{error}</p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-base font-bold text-theme-title hover:text-theme-title/80 uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Shield */}
            <div className="mx-auto h-14 w-14 border border-theme-title/30 bg-theme-title/10 flex items-center justify-center text-theme-title rounded-full">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <span className="text-base font-bold text-theme-title uppercase tracking-widest block bg-theme-title/10 border border-theme-title/20 px-3 py-1 rounded-full w-max mx-auto">
                ✔ Authenticated Certificate
              </span>
              <h1 className="font-serif text-2xl font-light text-theme-title pt-3">DARSHI SOFTWARE SOLUTIONS PRIVATE LIMITED CREDENTIAL</h1>
              <p className="text-theme-desc text-base">This credential has been digitally verified and matches our official records.</p>
            </div>

            {/* Certificate Details Card */}
            <div className="bg-theme-card border border-theme-border p-6 text-left space-y-4 rounded-xl">
              <div className="flex gap-3 items-start border-b border-theme-divider pb-3">
                <Award className="h-5 w-5 text-theme-title shrink-0 mt-0.5" />
                <div>
                  <span className="text-base text-theme-title uppercase font-bold tracking-wider block">Student Name</span>
                  <strong className="text-theme-card-title text-md font-bold">{certData?.studentName}</strong>
                  <p className="text-base text-theme-desc">{certData?.college}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start border-b border-theme-divider pb-3">
                <Bookmark className="h-5 w-5 text-theme-title shrink-0 mt-0.5" />
                <div>
                  <span className="text-base text-theme-title uppercase font-bold tracking-wider block">Program Completed</span>
                  <strong className="text-theme-card-title text-md font-bold">{certData?.courseTitle}</strong>
                  <p className="text-base text-theme-desc">Duration: {certData?.duration}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Calendar className="h-5 w-5 text-theme-title shrink-0 mt-0.5" />
                <div>
                  <span className="text-base text-theme-title uppercase font-bold tracking-wider block">Date of Issuance</span>
                  <span className="text-theme-body text-base font-semibold">
                    {new Date(certData?.issuedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col items-center gap-1">
              <span className="text-base text-theme-title uppercase tracking-widest font-mono">Certificate Serial ID</span>
              <span className="text-theme-body text-base font-mono select-all bg-theme-card border border-theme-border px-3 py-1 rounded-full">
                {certData?.certificateId}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
