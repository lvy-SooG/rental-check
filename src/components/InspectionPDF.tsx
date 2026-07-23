"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Inspection, Room, RoomPhoto, DetectedItem } from "@/lib/types";
import { formatDate, getConditionLabel } from "@/lib/utils";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf" },
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1f2937",
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: "#3b82f6",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  infoItem: {
    width: "50%",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    color: "#1f2937",
  },
  roomSection: {
    marginBottom: 25,
  },
  roomTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
    backgroundColor: "#f3f4f6",
    padding: 8,
    paddingLeft: 12,
  },
  phaseTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    marginTop: 15,
    padding: 6,
    backgroundColor: "#e5e7eb",
  },
  phaseTitleMoveIn: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },
  phaseTitleMoveOut: {
    backgroundColor: "#ffedd5",
    color: "#c2410c",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  photoContainer: {
    width: "48%",
    marginRight: "2%",
    marginBottom: 10,
  },
  photo: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 4,
  },
  photoName: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 4,
  },
  analysis: {
    fontSize: 10,
    color: "#4b5563",
    marginTop: 6,
    lineHeight: 1.4,
  },
  itemsTable: {
    marginTop: 8,
  },
  itemsHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    padding: 6,
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  itemRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: 1,
    borderBottomColor: "#f3f4f6",
    fontSize: 10,
  },
  itemName: {
    width: "30%",
  },
  itemCondition: {
    width: "20%",
  },
  itemLocation: {
    width: "25%",
  },
  itemNotes: {
    width: "25%",
  },
  conditionGood: {
    color: "#059669",
  },
  conditionFair: {
    color: "#d97706",
  },
  conditionPoor: {
    color: "#ea580c",
  },
  conditionDamaged: {
    color: "#dc2626",
  },
  summaryBox: {
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 10,
    color: "#1e3a8a",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#9ca3af",
    borderTop: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
  },
  signatureLine: {
    borderBottom: 1,
    borderBottomColor: "#000",
    marginTop: 30,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  comparisonSection: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 6,
    marginTop: 15,
  },
  comparisonLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 4,
  },
});

function getConditionStyle(condition: string) {
  switch (condition) {
    case "good":
      return styles.conditionGood;
    case "fair":
      return styles.conditionFair;
    case "poor":
      return styles.conditionPoor;
    case "damaged":
      return styles.conditionDamaged;
    default:
      return {};
  }
}

function ItemsTable({ items }: { items: DetectedItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.itemsTable}>
      <View style={styles.itemsHeader}>
        <Text style={styles.itemName}>Item</Text>
        <Text style={styles.itemCondition}>Condition</Text>
        <Text style={styles.itemLocation}>Location</Text>
        <Text style={styles.itemNotes}>Notes</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={[styles.itemCondition, getConditionStyle(item.condition)]}>
            {getConditionLabel(item.condition)}
          </Text>
          <Text style={styles.itemLocation}>{item.location || "-"}</Text>
          <Text style={styles.itemNotes}>{item.notes || "-"}</Text>
        </View>
      ))}
    </View>
  );
}

function PhotoSection({ photos, title, titleStyle }: { photos: RoomPhoto[]; title: string; titleStyle: typeof styles.phaseTitleMoveIn }) {
  if (photos.length === 0) return null;

  const allItems: DetectedItem[] = [];
  photos.forEach((photo) => {
    if (photo.items) {
      allItems.push(...photo.items);
    }
  });

  return (
    <View>
      <Text style={[styles.phaseTitle, titleStyle]}>{title}</Text>
      <View style={styles.photoGrid}>
        {photos.map((photo) => (
          <View key={photo.id} style={styles.photoContainer}>
            <Image src={photo.url} style={styles.photo} />
            <Text style={styles.photoName}>{photo.name}</Text>
            {photo.aiAnalysis && (
              <Text style={styles.analysis}>{photo.aiAnalysis}</Text>
            )}
          </View>
        ))}
      </View>
      {allItems.length > 0 && <ItemsTable items={allItems} />}
    </View>
  );
}

function RoomSection({ room }: { room: Room }) {
  const moveInPhotos = room.photos.filter((p) => p.phase === "move-in");
  const moveOutPhotos = room.photos.filter((p) => p.phase === "move-out");
  const hasBothPhases = moveInPhotos.length > 0 && moveOutPhotos.length > 0;

  const allItems: DetectedItem[] = [];
  room.photos.forEach((photo) => {
    if (photo.items) {
      allItems.push(...photo.items);
    }
  });

  return (
    <View style={styles.roomSection}>
      <Text style={styles.roomTitle}>{room.name}</Text>

      {room.photos.length > 0 ? (
        <>
          {hasBothPhases ? (
            <>
              <PhotoSection
                photos={moveInPhotos}
                title="Move-In Photos"
                titleStyle={styles.phaseTitleMoveIn}
              />
              <PhotoSection
                photos={moveOutPhotos}
                title="Move-Out Photos"
                titleStyle={styles.phaseTitleMoveOut}
              />
            </>
          ) : (
            <View style={styles.photoGrid}>
              {room.photos.map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image src={photo.url} style={styles.photo} />
                  <Text style={styles.photoName}>{photo.name}</Text>
                  {photo.aiAnalysis && (
                    <Text style={styles.analysis}>{photo.aiAnalysis}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <Text style={{ fontSize: 10, color: "#9ca3af" }}>No photos</Text>
      )}

      {room.notes && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 4 }}>
            Notes:
          </Text>
          <Text style={{ fontSize: 10, color: "#4b5563" }}>{room.notes}</Text>
        </View>
      )}
    </View>
  );
}

export function InspectionPDF({ inspection }: { inspection: Inspection }) {
  const totalPhotos = inspection.rooms.reduce(
    (sum, room) => sum + room.photos.length,
    0
  );

  const moveInPhotos = inspection.rooms.reduce(
    (sum, room) => sum + room.photos.filter((p) => p.phase === "move-in").length,
    0
  );

  const moveOutPhotos = inspection.rooms.reduce(
    (sum, room) => sum + room.photos.filter((p) => p.phase === "move-out").length,
    0
  );

  const totalItems = inspection.rooms.reduce((sum, room) => {
    return (
      sum +
      room.photos.reduce((s, photo) => s + (photo.items?.length || 0), 0)
    );
  }, 0);

  const damagedItems = inspection.rooms.reduce((sum, room) => {
    return (
      sum +
      room.photos.reduce(
        (s, photo) =>
          s + (photo.items?.filter((i) => i.condition === "damaged").length || 0),
        0
      )
    );
  }, 0);

  const hasMoveOut = inspection.moveOutDate || moveOutPhotos > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {hasMoveOut ? "Move-In/Move-Out Inspection Report" : "Move-In Inspection Report"}
          </Text>
          <Text style={styles.subtitle}>
            Generated on {formatDate(new Date())}
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Report Summary</Text>
          <Text style={styles.summaryText}>
            Property: {inspection.propertyAddress}
            {"\n"}
            Move-in Date: {formatDate(inspection.moveInDate)}
            {inspection.moveOutDate && `\nMove-out Date: ${formatDate(inspection.moveOutDate)}`}
            {"\n"}
            Rooms inspected: {inspection.rooms.length} | Total Photos: {totalPhotos}
            {hasMoveOut && ` | Move-in: ${moveInPhotos} | Move-out: ${moveOutPhotos}`}
            {"\n"}
            Items documented: {totalItems}
            {damagedItems > 0 && ` | Damaged items: ${damagedItems}`}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Property Address</Text>
              <Text style={styles.infoValue}>{inspection.propertyAddress}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Move-in Date</Text>
              <Text style={styles.infoValue}>
                {formatDate(inspection.moveInDate)}
              </Text>
            </View>
            {inspection.moveOutDate && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Move-out Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(inspection.moveOutDate)}
                </Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tenant Name</Text>
              <Text style={styles.infoValue}>{inspection.tenantName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tenant Email</Text>
              <Text style={styles.infoValue}>{inspection.tenantEmail}</Text>
            </View>
            {inspection.landlordName && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Landlord / Property Manager</Text>
                <Text style={styles.infoValue}>{inspection.landlordName}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            This report was generated by RentalCheck on{" "}
            {formatDate(new Date())}
          </Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={[styles.title, { fontSize: 18, marginBottom: 20 }]}>
          Room-by-Room Inspection
        </Text>

        {inspection.rooms.map((room) => (
          <RoomSection key={room.id} room={room} />
        ))}

        <View style={styles.footer}>
          <Text>
            This report was generated by RentalCheck on{" "}
            {formatDate(new Date())}
          </Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={[styles.title, { fontSize: 18, marginBottom: 30 }]}>
          {hasMoveOut ? "Signatures & Dispute Resolution" : "Signatures"}
        </Text>

        <Text style={{ fontSize: 11, marginBottom: 20, color: "#4b5563" }}>
          {hasMoveOut
            ? "By signing below, both parties acknowledge that they have reviewed this move-in/move-out inspection report and agree that the property condition is accurately documented. Any discrepancies between move-in and move-out conditions may be used as evidence for security deposit disputes."
            : "By signing below, both parties acknowledge that they have reviewed this move-in inspection report and agree that the property condition is accurately documented as of the move-in date."}
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>&nbsp;</Text>
            <Text style={styles.signatureLabel}>
              Tenant Signature - {inspection.tenantName}
            </Text>
            <Text style={[styles.signatureLabel, { marginTop: 4 }]}>
              Date: _______________
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>&nbsp;</Text>
            <Text style={styles.signatureLabel}>
              Landlord / Property Manager Signature
            </Text>
            <Text style={[styles.signatureLabel, { marginTop: 4 }]}>
              Date: _______________
            </Text>
          </View>
        </View>

        <View style={[styles.summaryBox, { marginTop: 60 }]}>
          <Text style={styles.summaryLabel}>Important Notice</Text>
          <Text style={styles.summaryText}>
            {hasMoveOut
              ? "This report serves as documentation of the property condition at both move-in and move-out. Both parties should keep a copy for their records. In case of disputes regarding security deposit deductions, this report can be used as evidence showing the condition changes between move-in and move-out. Photos with timestamps provide additional verification."
              : "This report serves as documentation of the property condition at the time of move-in. Both parties should keep a copy for their records. In case of disputes regarding security deposit deductions at move-out, this report can be used as evidence of the initial condition. Photos with timestamps provide additional verification."}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            This report was generated by RentalCheck on{" "}
            {formatDate(new Date())}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
