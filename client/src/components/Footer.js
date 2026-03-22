function Footer() {
  return (
    <footer
      style={{
        marginTop: "50px",
        background: "#0f172a",
        color: "#e2e8f0",
        padding: "25px 20px",
        textAlign: "center",
        borderRadius: "12px 12px 0 0",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>
        💰 FundRise
      </h3>

      <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#94a3b8" }}>
        Helping people raise funds for meaningful causes.
      </p>

      <div style={{ fontSize: "13px", color: "#64748b" }}>
        © {new Date().getFullYear()} FundRise • Built with MERN Stack
      </div>
    </footer>
  );
}

export default Footer;