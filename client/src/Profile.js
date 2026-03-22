import { useEffect, useState } from "react";
import axios from "axios";

function Profile({ token }) {
  const [myCampaigns, setMyCampaigns] = useState([]);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/campaign/my-campaigns", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        })
        .then((res) => setMyCampaigns(res.data.campaigns || [])) // ✅ FIX
        .catch((err) =>
          console.error(
            "Error fetching my campaigns:",
            err.response?.data || err.message
          )
        );
    }
  }, [token]);

  const totalRaised = myCampaigns.reduce(
    (sum, c) => sum + Number(c.collectedAmount || 0),
    0
  );

  return (
    <div className="profile-sidebar">
      <div className="profile-header">
        <span className="profile-icon">👤</span>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>My Campaigns</h2>
          <p className="total-stat">
            Total Raised: ₹{totalRaised.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mini-campaign-list">
        {myCampaigns.length > 0 ? (
          myCampaigns.map((c) => (
            <div key={c._id} className="mini-card">
              <h4 className="mini-title">{c.title}</h4>

              <p className="mini-stats">
                ₹{(c.collectedAmount || 0).toLocaleString()}
                <span className="mini-target">
                  {" "}
                  raised of ₹{(c.targetAmount || 0).toLocaleString()}
                </span>
              </p>

              <div className="mini-progress">
                <div
                  className="mini-fill"
                  style={{
                    width: `${
                      Math.min(
                        ((c.collectedAmount || 0) /
                          (c.targetAmount || 1)) *
                          100,
                        100
                      ) || 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              opacity: 0.5,
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            No campaigns launched yet.
          </p>
        )}
      </div>

      <style>{`
        .profile-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .dark .profile-header {
          border-color: rgba(255,255,255,0.1);
        }

        .profile-icon {
          font-size: 28px;
          background: #e0e7ff;
          padding: 10px;
          border-radius: 12px;
        }

        .total-stat {
          margin: 0;
          font-weight: 700;
          color: #2563eb;
        }

        .mini-campaign-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mini-card {
          background: white;
          padding: 15px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
        }

        .dark .mini-card {
          background: #1e293b;
          border-color: #334155;
        }

        .mini-title {
          margin: 0 0 5px 0;
          font-size: 15px;
        }

        .mini-stats {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
        }

        .mini-target {
          font-weight: 400;
          opacity: 0.6;
        }

        .mini-progress {
          height: 4px;
          background: #e2e8f0;
          border-radius: 10px;
          margin-top: 10px;
          overflow: hidden;
        }

        .mini-fill {
          height: 100%;
          background: #10b981;
        }
      `}</style>
    </div>
  );
}

export default Profile;