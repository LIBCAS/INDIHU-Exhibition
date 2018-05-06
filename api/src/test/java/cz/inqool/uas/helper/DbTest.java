package cz.inqool.uas.helper;

import org.hibernate.internal.SessionImpl;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public abstract class DbTest {
    private static EntityManagerFactory factory;

    private EntityManager em;

    protected EntityManager getEm() {
        return em;
    }

    protected void flushCache() {
        if (em != null) {
            em.getTransaction().commit();
        } else {
            em = factory.createEntityManager();
        }

        em.getTransaction().begin();
    }

    @BeforeClass
    public static void classSetUp() {
        factory = Persistence.createEntityManagerFactory("test");
    }

    @AfterClass
    public static void classTearDown() {
        if (factory != null) {
            factory.close();
            factory = null;
        }
    }

    @Before
    public void testSetUp() throws SQLException {
        flushCache();

        setSyntax();
    }

    @After
    public void testTearDown() throws SQLException {
        if (em != null) {
            clearDatabase();

            em.close();
            em = null;
        }
    }

    public void setSyntax() throws SQLException {
        Connection c = ((SessionImpl) em.getDelegate()).connection();
        Statement s = c.createStatement();

        s.execute("SET DATABASE SQL SYNTAX PGS TRUE");
        s.close();
    }

    public void clearDatabase() throws SQLException {
        Connection c = ((SessionImpl) em.getDelegate()).connection();
        Statement s = c.createStatement();

        //s.execute("DROP SCHEMA PUBLIC CASCADE ");
        s.execute("TRUNCATE SCHEMA PUBLIC AND COMMIT");
        s.close();
    }
}
