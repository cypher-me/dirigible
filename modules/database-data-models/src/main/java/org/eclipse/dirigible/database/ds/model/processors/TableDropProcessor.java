package org.eclipse.dirigible.database.ds.model.processors;

import static java.text.MessageFormat.format;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.eclipse.dirigible.database.ds.model.DataStructureTableModel;
import org.eclipse.dirigible.database.sql.SqlFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TableDropProcessor {

	private static final Logger logger = LoggerFactory.getLogger(TableDropProcessor.class);

	public static void execute(Connection connection, DataStructureTableModel tableModel) throws SQLException {
		logger.info("Processing Drop Table: " + tableModel.getName());
		if (SqlFactory.getNative(connection).exists(connection, tableModel.getName())) {
			String sql = SqlFactory.getNative(connection).select().column("COUNT(*)").from(tableModel.getName()).build();
			Statement statement = connection.createStatement();
			try {
				logger.info(sql);
				ResultSet resultSet = statement.executeQuery(sql);
				if (resultSet.next()) {
					int count = resultSet.getInt(1);
					if (count > 0) {
						logger.error(
								format("Drop operation for the non empty Table [{0}] will not be executed. Delete all the records in the table first.",
										tableModel.getName()));
						return;
					}
				}
			} catch (SQLException e) {
				logger.error(sql);
				logger.error(e.getMessage(), e);
			} finally {
				if (statement != null) {
					statement.close();
				}
			}

			sql = SqlFactory.getNative(connection).drop().table(tableModel.getName()).build();
			statement = connection.createStatement();
			try {
				logger.info(sql);
				statement.executeUpdate(sql);
			} catch (SQLException e) {
				logger.error(sql);
				logger.error(e.getMessage(), e);
			} finally {
				if (statement != null) {
					statement.close();
				}
			}
		}
	}

}