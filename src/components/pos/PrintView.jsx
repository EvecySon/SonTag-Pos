
import React, { forwardRef } from 'react';

const PrintView = forwardRef(({ type, data }, ref) => {
  if (!data) return null;

  const renderContent = () => {
    switch (type) {
      case 'final-receipt':
        return <FinalPrintout data={{ ...data, isReceipt: true }} />;
      case 'table-bill':
        return <FinalPrintout data={data} />;
      case 'item-invoice':
        return <ItemInvoice data={data} />;
      default:
        return <div>Unsupported print type</div>;
    }
  };

  return (
    <div className="hidden print:block">
      <div ref={ref} style={styles.page}>
        {renderContent()}
      </div>
    </div>
  );
});

const FinalPrintout = ({ data }) => {
  const { items, subtotal, tax, total, paymentDetails, waiter, cashier, branch, section, serviceType, table, id, isReceipt, isDraft } = data;
  
  const title = isReceipt ? 'RECEIPT' : (isDraft ? 'DRAFT BILL' : 'BILL');
  const footerMessage = isReceipt ? 'Thank you for your visit!' : 'Please proceed to the counter for payment.';
  const businessInfo = JSON.parse(localStorage.getItem('businessInfo') || '{}');

  return (
    <div style={styles.container}>
      <TopHeader businessName={businessInfo.name || "SonTag POS/ERP software"}/>
      <Header branch={branch} section={section} />
      <hr style={styles.dashedHr} />
      <h2 style={styles.subHeader}>{title}</h2>
      <hr style={styles.dashedHr} />
      <div style={{...styles.section, borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
        <p><strong>No:</strong> #{id || Math.floor(Date.now() / 1000)}</p>
        <p><strong>Date:</strong> {new Date(id || Date.now()).toLocaleString()}</p>
        <p><strong>Service Type:</strong> {serviceType}</p>
        {serviceType === 'Dine-in' && table && <p><strong>Table:</strong> {table}</p>}
        {waiter && <p><strong>Served by:</strong> {waiter}</p>}
        {cashier && <p><strong>Processed by:</strong> {cashier}</p>}
      </div>
      <hr style={styles.dashedHr} />
      <ItemsTable items={items} />
      <hr style={styles.dashedHr} />
      <Totals subtotal={subtotal} tax={tax} total={total} />
      {isReceipt && <hr style={styles.dashedHr} />}
      {isReceipt && <PaymentInfo paymentDetails={paymentDetails} />}
      <hr style={styles.dashedHr} />
      <Footer message={footerMessage} />
    </div>
  );
};


const ItemInvoice = ({ data }) => {
    const { items, table, section, user, branch } = data;
    const businessInfo = JSON.parse(localStorage.getItem('businessInfo') || '{}');
    return (
        <div style={styles.container}>
            <TopHeader businessName={businessInfo.name || "SonTag POS/ERP software"}/>
            <Header branch={branch} section={section} />
            <hr style={styles.dashedHr} />
            <div style={styles.section}>
                <h2 style={styles.subHeader}>KITCHEN/BAR ORDER</h2>
                <p><strong>Table:</strong> {table || 'Takeaway'}</p>
                <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                <p><strong>Staff:</strong> {user}</p>
            </div>
            <hr style={styles.dashedHr} />
            <ItemsTable items={items} showPrice={false} />
            <hr style={styles.dashedHr} />
            <Footer />
        </div>
    );
};

const TopHeader = ({ businessName }) => (
    <div style={styles.topHeader}>
      <span>{new Date().toLocaleString()}</span>
      <span>{businessName}</span>
    </div>
);

const Header = ({ branch, section }) => {
  const businessInfo = JSON.parse(localStorage.getItem('businessInfo') || '{}');

  return (
    <div style={styles.header}>
      <h1 style={styles.title}>{businessInfo.name || "SonTag POS/ERP software"}</h1>
      <p>{businessInfo.address || "123 Main Street, Anytown, USA"}</p>
      <p>Tel: {businessInfo.phone || "(123) 456-7890"} | Email: {businessInfo.email || "contact@sontag.com"}</p>
      <hr style={styles.dashedHr} />
      {branch && <p><strong>Branch:</strong> {branch.name} ({branch.location})</p>}
      {section && <p><strong>Section:</strong> {section}</p>}
    </div>
  );
};

const ItemsTable = ({ items, showPrice = true }) => (
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.th}>ITEM</th>
        <th style={{ ...styles.th, ...styles.center }}>QTY</th>
        {showPrice && <th style={{ ...styles.th, ...styles.right }}>PRICE</th>}
      </tr>
    </thead>
    <tbody>
      {(items || []).map((item, index) => (
        <tr key={index}>
          <td style={styles.td}>{item.name}</td>
          <td style={{ ...styles.td, ...styles.center }}>{item.qty}</td>
          {showPrice && <td style={{ ...styles.td, ...styles.right }}>${((item.price || 0) * item.qty).toFixed(2)}</td>}
        </tr>
      ))}
    </tbody>
  </table>
);

const Totals = ({ subtotal, tax, total }) => (
  <div style={styles.section}>
    <div style={styles.flexBetween}>
      <span>Subtotal</span>
      <span>${(subtotal || 0).toFixed(2)}</span>
    </div>
    <div style={styles.flexBetween}>
      <span>Tax (10%)</span>
      <span>${(tax || 0).toFixed(2)}</span>
    </div>
    <div style={{...styles.flexBetween, ...styles.bold, ...styles.total}}>
      <span>TOTAL</span>
      <span>${(total || 0).toFixed(2)}</span>
    </div>
  </div>
);

const PaymentInfo = ({ paymentDetails }) => {
    if (!paymentDetails) return null;
    
    const renderMultipleDetails = () => {
        const details = paymentDetails.details;
        return (
            <>
                {details.cash > 0 && <div style={styles.flexBetween}><span>- Cash:</span><span>${details.cash.toFixed(2)}</span></div>}
                {details.card > 0 && <div style={styles.flexBetween}><span>- Card:</span><span>${details.card.toFixed(2)}</span></div>}
                {details.bank > 0 && <div style={styles.flexBetween}><span>- Bank Transfer:</span><span>${details.bank.toFixed(2)}</span></div>}
            </>
        );
    };

    return (
        <div style={styles.section}>
            <div style={styles.flexBetween}>
                <span style={styles.bold}>PAYMENT METHOD:</span>
                <span style={styles.bold}>{paymentDetails.method.replace(/_/g, ' ').toUpperCase()}</span>
            </div>
            {paymentDetails.method === 'cash' && (
                <>
                    <div style={styles.flexBetween}>
                        <span>Cash Received:</span>
                        <span>${paymentDetails.received.toFixed(2)}</span>
                    </div>
                    <div style={styles.flexBetween}>
                        <span>Change:</span>
                        <span>${paymentDetails.change.toFixed(2)}</span>
                    </div>
                </>
            )}
            {paymentDetails.method === 'multiple' && renderMultipleDetails()}
        </div>
    );
};


const Footer = ({ message }) => (
  <div style={styles.footer}>
    {message && <p>{message}</p>}
    <p>Please come again.</p>
    <div style={{ ...styles.developerInfo, fontSize: '10px' }}>
      <p>SonTag POS/ERP software | Developed by SonTag Technologies</p>
      <p>Phone: +234-901-904-2426</p>
    </div>
  </div>
);


const styles = {
  page: {
    padding: '10mm',
    '@media print': {
        padding: '0',
    }
  },
  container: {
    width: '300px',
    margin: '0 auto',
    padding: '16px',
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'monospace',
    fontSize: '12px',
    lineHeight: '1.4',
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
  },
  subHeader: {
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0',
    padding: '4px 0',
  },
  section: {
    paddingTop: '8px',
    marginTop: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '8px',
    marginBottom: '8px',
  },
  th: {
    textAlign: 'left',
    paddingBottom: '4px',
    borderBottom: '1px solid #000',
  },
  td: {
    padding: '4px 0',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 0',
  },
  bold: {
    fontWeight: 'bold',
  },
  total: {
    fontSize: '14px',
    marginTop: '4px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '8px',
    paddingTop: '8px',
  },
  developerInfo: {
    marginTop: '8px',
    borderTop: '1px dashed #000',
    paddingTop: '8px',
    color: '#555',
  },
  dashedHr: {
    border: 'none',
    borderTop: '1px dashed #000',
    margin: '8px 0',
  },
};


PrintView.displayName = 'PrintView';
export default PrintView;
